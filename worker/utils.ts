import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import { MongoClient } from "mongodb";

const mongoUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);
const connection = new Connection(clusterApiUrl("devnet"));
const mintAddress = "BFWuL6dfwvGc4bQcPYFi7uEnaVMEddvhxwgSiLZzSNfb";

interface PlayerAmounts {
    [address: string]: number;
  }

// functions that help jobs
async function insertNewRound(epoch: number, players: PlayerAmounts) {
  const db = client.db("lottos");
  const collection = db.collection("rounds");
  const round = await collection.findOne({ epoch: epoch });
  if (!round) {
    let newRound = {
      epoch: epoch,
      winner: null,
      players: {},
      pot: 0,
      txid: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
    };
    await collection.insertOne(newRound);
  } else {
    console.log("Epoch already exists");
  }
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

async function takeSnapshot() {
  // check for the round data first
  const mint = new PublicKey(mintAddress);
  const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165, // size of account (bytes)
      },
      {
        memcmp: {
          offset: 0, // location of our query in the account (bytes)
          bytes: mint.toBase58(), // our search criteria, a base58 encoded string
        },
      },
    ],
  });

  const nonZeroHolders = accounts
    .map((account) => {
      const accountData = AccountLayout.decode(account.account.data);
      const amount = new BN(accountData.amount.toString(), "le");

      return {
        address: account.pubkey.toString(),
        amount: Number(amount.toString()) * 100,
      };
    })
    .filter((holder) => holder.amount !== 0);

  const players = nonZeroHolders.reduce<PlayerAmounts>((acc, player) => {
    acc[player.address] = Number(player.amount);
    return acc;
  }, {});
  return players;
}