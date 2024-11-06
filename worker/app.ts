import { clusterApiUrl, Connection, EpochInfo, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { MongoClient } from "mongodb";
import { PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, getAccount } from "@solana/spl-token";
import bs58 from 'bs58';

import schedule from 'node-schedule';

const connection = new Connection(process.env.RPC!); 
const mintAddress = process.env.MINT_ADDRESS!;
const client = new MongoClient(process.env.MONGO!);

interface Epoch{
  number: number;
  progress: number
}

interface Player {
  address: string;
  enteredAt: number;
  exitedAt: number;
  oldBalance: number;
  balance: number;
  score: number;
}

interface Round {
  epoch: number
  winner: string|null;
  players: Player[];
  pot: number;
  odds: number;
  tx: string|null;
  createdAt: Date;
  updatedAt: Date;
  ended: boolean;
}

interface Ticket {
  owner: string;
  number: number;
}

async function run() {
  const epoch: Epoch = await getCurrentEpoch()
  const players: Player[] =  await getPlayers(epoch);
  
  let round = await getRound(epoch.number);

  if (!round) {
    const previousRound = await getRound(epoch.number - 1);

    if(previousRound) {
      await endRound(previousRound);
    }

    await createRound(epoch.number, players, previousRound)

    round = await getRound(epoch.number)
  } else {
    players.forEach((newPlayer: Player) => {
      const existingPlayer = round?.players.find((player: Player) => player.address === newPlayer.address);
  
      if (existingPlayer) {
          existingPlayer.oldBalance = existingPlayer.balance;
          existingPlayer.balance = newPlayer.balance;
      } else {
          round?.players.push(newPlayer);
      }
  });

  round.players = await updateScores(epoch.progress, round.players);

  updateRound(round);
  }
}

async function getRound(epoch: number) {
  const db = client.db("lottos");
  const collection = db.collection("rounds");

  return await collection.findOne({ epoch: epoch });
}

async function getCurrentEpoch(): Promise<Epoch> {
  const epochInfo: EpochInfo = await connection.getEpochInfo();

  const epoch: Epoch = 
  {
    number: epochInfo.epoch,
    progress: Math.round((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100)
  }

  return epoch;
}

// functions that help jobs
async function createRound(epoch: number, players: Array<Player>, previousRound: any) {
  console.log('CREATE ROUND')
  const db = client.db("lottos");
  const collection = db.collection("rounds");
  const hadWinner = previousRound && previousRound.tx ? true: false

  const pot = await getJackpot(epoch - 1, hadWinner ? null : previousRound?.pot);
  const odds = await getOdds(previousRound?.odds, hadWinner);

  const round: Round = {
    epoch,
    winner: null,
    players,
    pot,
    odds,
    tx: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ended: false,
  };

  return await collection.insertOne(round);
}

async function getJackpot(epoch: number, previousPot: number|null ): Promise<number> {
  const rewards = await getValidatorRewards(epoch)
  
  let pot: number = (rewards / 3.5)

  if(previousPot) {
    pot += previousPot;
  }

  if(process.env.BONUS) {
    const bonus = Number(process.env.BONUS);

    if(bonus > 0) {
      pot += bonus;
    }
  }

  return Number(pot.toFixed(9));
}

async function getOdds(previousOdds: number | null, hadWinner: boolean) {
  if (!previousOdds || previousOdds == 100 || hadWinner) {
    return 10;
  }

  return previousOdds + 10;
  
}

async function updateScores(epochProgress: number, players: Player[]) {
  players.forEach((player: Player) => {
    if(player.balance < 1) {
      player.exitedAt = epochProgress;

      if(player.oldBalance > 1) {
        player.score = player.exitedAt - player.enteredAt;
      } else {
        player.score = 0;
      }
    } else {
      const newScore = 100 - epochProgress;

      if(player.score < newScore) {
        player.score = newScore;
      }
    }
  })
 
  return players;
}

async function updateRound(round: any) {
  console.log('UPDATE ROUND')
  const db = client.db("lottos");
  const collection = db.collection("rounds");

  round.updatedAt = new Date();

  await collection.updateOne({ _id: round._id }, {$set: round}) 
}

async function endRound(round: any) {
  if (!round.winner) {
    const winner = pullWinner(round.players, round.pot, round.odds);

    if(winner) {
      round.tx = await sendWinnings(winner, round.pot);
      round.winner = winner;
    }

    round.ended = true;

    await updateRound(round);
  }
}

function pullWinner(players: Player[], pot: number, odds: number): string|null {
  console.log('PULL WINNER')

  const eligiblePlayers = players.filter((player: Player) => player.score > 50);
  const tickets: Ticket [] = [];
  let currentTicketNumber = 0

  eligiblePlayers.forEach((player: Player) => {
    for (let i = 0; i < player.score; i++) {
      const ticket = {
        owner: player.address,
        number: currentTicketNumber
      }

      tickets.push(ticket);
      currentTicketNumber++;
    }
  })

  console.log(`${tickets.length} tickets`)

  const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const winningTicket = tickets[getRandomNumber(0, tickets.length)]
  
  const hitsJackpot = getRandomNumber(0, 100) <= odds;
  console.log(`JACKPOT: ${hitsJackpot}`)

  if(hitsJackpot) {
    return winningTicket.owner;
  }

  return null
}

async function getPlayers(epoch: Epoch): Promise<Player[]> {
  console.log('GET PLAYERS')
  // TODO use mainnet global connection
  const connection = new Connection(clusterApiUrl("devnet"));
  const mint = new PublicKey(mintAddress);
  const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mint.toBase58(),
        },
      },
    ],
  });

  const players = accounts
    .map((account: any) => {
      const accountData = AccountLayout.decode(account.account.data);

      let player: Player = {
        address: account.pubkey.toString(),
        oldBalance: 0,
        balance: Number(accountData.amount) / (10 ** 9),
        enteredAt: epoch.progress,
        exitedAt: 0,
        score: 0
      };

      return player
    })
    .filter((player: Player) => player.balance !== 0);

  return players;
}

async function getValidatorRewards(epoch: number) {
  console.log('GET REWARDS')
  const rewards = await connection.getInflationReward([new PublicKey(process.env.VALIDATOR_ADDRESS!)], epoch); 

  if (rewards && rewards[0]) {
    return rewards[0].amount / (10 ** 9)
  }

  return 0;
}

async function sendWinnings(recipient: string, amount: number): Promise<string> {
  console.log('SEND WINNINGS')
  // TODO use mainnet global connection
  const connection = new Connection(clusterApiUrl("devnet"));
  const secret = bs58.decode(process.env.SECRET!)
  const keyPair = Keypair.fromSecretKey(new Uint8Array(Array.from(secret)));
  
  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection, 
    keyPair,
    new PublicKey(mintAddress),
    keyPair.publicKey
  );

  let destinationAccount = await getAccount(
    connection, 
    new PublicKey(recipient)
  );

  const tx = new Transaction();
 
  tx.add(createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      keyPair.publicKey,
      amount * Math.pow(10, 9),
  ))

  const latestBlockHash = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = await latestBlockHash.blockhash;    
  const signature = await sendAndConfirmTransaction(connection,tx,[keyPair]);
  console.log(
      '\x1b[32m', //Green Text
      `   Transaction Success!🎉`,
      `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  return signature;
}



// every hour '0 * * * *'
// every 30 seconds '*/30 * * * * *'
const job = schedule.scheduleJob(process.env.CRON!, async () => {
  run()
});
