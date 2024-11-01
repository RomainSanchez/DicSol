import { clusterApiUrl, Connection, EpochInfo, Keypair, Transaction, sendAndConfirmTransaction, SystemProgram, ParsedAccountData } from "@solana/web3.js";
import Queue from "bull";
import { MongoClient } from "mongodb";
import { PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, getAccount } from "@solana/spl-token";
import bs58 from 'bs58';
import * as dotenv from 'dotenv';

dotenv.config()

const connection = new Connection(process.env.RPC); 
const mintAddress = process.env.MINT_ADDRESS;
const client = new MongoClient(process.env.MONGO);

interface Epoch{
  number: number;
  progress: number
}

interface Player {
  address: string;
  startedAt: number;
  oldBalance: number;
  balance: number;
  score: number;
}

interface Round {
  epoch: number
  winner: string|null;
  players: Player[];
  pot: number;
  tx: string|null;
  createdAt: Date;
  updatedAt: Date;
  ended: boolean;
}

async function run() {
  const epoch: Epoch = await getCurrentEpoch()
  const players: Player[] =  await getPlayers(epoch);
  
  let round = await getRound(epoch.number);

  if (!round) {
    await createRound(epoch.number, players)

    round = await getRound(epoch.number)

    endRound(epoch.number - 1)
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

    round.players = await updateScores(round.players);

    updateRound(round);
  }

  console.log(round)

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

  console.log(epoch)
  return epoch;
}

// functions that help jobs
async function createRound(epoch: number, players: Array<Player>) {
  console.log('CREATE ROUND')
  const db = client.db("lottos");
  const collection = db.collection("rounds");

  const pot = await getJackpot(epoch - 1)

  const round: Round = {
    epoch,
    winner: null,
    players,
    pot,
    tx: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ended: false,
  };

  return await collection.insertOne(round);
}

async function getJackpot(epoch: number): Promise<number> {
  const rewards = getValidatorRewards(epoch)
  return 2;
}

async function updateScores(players: Player[]) {
  // if start - end > 50 eligible
  // if start -
  return players;
}

async function updateRound(round) {
  console.log('UPDATE ROUND')
  const db = client.db("lottos");
  const collection = db.collection("rounds");

  round.updatedAt = new Date();

  await collection.updateOne({ _id: round._id }, {$set: round}) 
}

async function endRound(epoch: number) {
  const round = await getRound(epoch);
  
  if (!round.winner) {
    const winner = pullWinner(round.players);

    if(winner) {
      round.tx = await sendWinnings(winner.address, round.pot);
      round.winner = winner.address;
    }

    round.ended = true;

    await updateRound(round);
  }
}

function pullWinner(players: Player[]): Player {
  return players[1];
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
    .map((account) => {
      const accountData = AccountLayout.decode(account.account.data);

      let player: Player = {
        address: account.pubkey.toString(),
        oldBalance: 0,
        balance: Number(accountData.amount) / (10 ** 9),
        startedAt: epoch.progress,
        score: epoch.progress
      };

      return player
    })
    .filter((player) => player.balance !== 0);

  return players;
}

async function getValidatorRewards(epoch: number) {
  console.log('GET REWARDS')
  const rewards = await connection.getInflationReward([new PublicKey(process.env.VALIDATOR_ADDRESS)], epoch); 
console.log(rewards)
  if (rewards) { 
    return rewards; 
  }

  else throw new Error('Rewards not found');
}

async function sendWinnings(recipient: string, amount: number): Promise<string> {
  console.log('SEND WINNINGS')
  // TODO use mainnet global connection
  const connection = new Connection(clusterApiUrl("devnet"));
  const secret = bs58.decode(process.env.SECRET)
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



// run().then()
getJackpot(691)