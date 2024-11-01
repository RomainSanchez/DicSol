import { clusterApiUrl, Connection, EpochInfo, EpochSchedule } from "@solana/web3.js";
import Queue from "bull";
import { MongoClient } from "mongodb";
import { PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { NumericLiteral } from "typescript";

// https://old-nameless-bridge.solana-mainnet.quiknode.pro/6fdc470238c40c1c9c3754ed5035c71e0a9b0267
// BFWuL6dfwvGc4bQcPYFi7uEnaVMEddvhxwgSiLZzSNfb
// Dicscx2kpukGBATbjgsuzdbsVRFktV19BXEHofPQwEQF

// 59x5bh8dkGNsVPe5zNZQHiGsjpYnRxHVG6bdNoeUBxi6Dr7grsnkWdD4cMVHNNRMghysRKPBLJg4wYvqEbtrRpMq
// vote account
//4qvFxnUXYjBdcviCwVV7gKcGJMCENEBfS82hSLJUhyvu

const connection = new Connection('https://api.mainnet-beta.solana.com'); 
const mintAddress = "BFWuL6dfwvGc4bQcPYFi7uEnaVMEddvhxwgSiLZzSNfb";

const mongoUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);

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
  status: string;
}

async function run() {
  const epoch: Epoch = await getCurrentEpoch()
  const players: Player[] =  await getPlayers(epoch);
  
  let round = await getRound(epoch.number);

  if (!round) {
    await createRound(epoch.number, players)

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
  return epoch;
}

// functions that help jobs
async function createRound(epoch: number, players: Array<Player>) {
  console.log('CREATE ROUND')
  const db = client.db("lottos");
  const collection = db.collection("rounds");

  const round: Round = {
    epoch,
    winner: null,
    players,
    pot: 0,
    tx: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "pending",
  };

  return await collection.insertOne(round);
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

  await collection.updateOne({ _id: round._id }, {$set: round}) 
}

async function pullWinner(epoch: number) {
  const db = client.db("lottos");
  const collection = db.collection("rounds");
  const round = await collection.findOne({ epoch: epoch });
  if (round) {
    if (!round.winner) {
      // we dont alread have a winner, lets find one
      // get all players from round
      const players = round.players;
      console.log("Players:", players);

      // TO DO FINISH THIS

      // Add your additional logic here
    } else {
      console.log("Winner already exists:", round.winner);
    }
  } else {
    console.log("Epoch not found");
  }
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
  const validatorPubKey = '4qvFxnUXYjBdcviCwVV7gKcGJMCENEBfS82hSLJUhyvu';
  
  const rewards = await connection.getInflationReward([new PublicKey(validatorPubKey)], epoch); 

  if (rewards) { 
    return rewards; 
  }

  else throw new Error('Rewards not found');
}



run().then(()=> {
})