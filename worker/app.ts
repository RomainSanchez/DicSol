import { clusterApiUrl, Connection, EpochInfo } from "@solana/web3.js";
import Queue from "bull";
import Redis from "ioredis";
import { MongoClient } from "mongodb";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const mintAddress = "Dicscx2kpukGBATbjgsuzdbsVRFktV19BXEHofPQwEQF";

const mongoUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);

const redisConfig = {
  host: "127.0.0.1",
  port: 6379,
};

interface JobData {
  type: string;
  data: any;
}

interface PlayerAmounts {
  [address: string]: number;
}

// Create two Redis clients: one for subscribing and one for getting values
const subClient = new Redis(redisConfig);
const getClient = new Redis(redisConfig);
const setClient = new Redis(redisConfig);
subClient.config("SET", "notify-keyspace-events", "KEA");

// Subscribe to the keyspace notifications for the specified key
const keyToMonitor = "current_epoch";
const channel = `__keyspace@0__:${keyToMonitor}`;

// Listen for messages
subClient.on("message", async (channel, message) => {
  console.log(`Key '${keyToMonitor}' was modified. Operation: ${message}`);
  // if (message === "set") {
  //   try {
  //     const newValue = await getClient.get(keyToMonitor);
  //     console.log(`New value: ${newValue}`);

  //     const db = client.db("lottos");
  //     const collection = db.collection("rounds");
  //     const epoch = await collection.findOne({ epoch: { $gte: newValue } });
  //     if (!epoch) {

  //       console.log("New epoch detected pull winner for epoch:", Number(newValue)-1);
  //       await pullWinner(Number(newValue)-1);
  //       const players = await takeSnapshot();
  //       await insertNewRound(Number(newValue), players);
  //     } else {
  //       console.log("Epoch already exists");
  //     }
  //     client.close();
  //   } catch (err) {
  //     console.error('Error getting new value:', err);
  //   }
  // }
});

// Handle errors
subClient.on("error", (err) => console.error("Redis subscription error:", err));
getClient.on("error", (err) => console.error("Redis client error:", err));

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

const jobQueue = new Queue("jobQueue", {
  redis: redisConfig,
});

async function startQueue() {
  // SYSTEM WIDE INIT

  console.log("Welcome to the queue worker");
  // get current epoch from solana and completition percentage
  const epochInfo: EpochInfo = await connection.getEpochInfo();
  console.log("Epoch Info: ", epochInfo);
  let epoch_completed_percent =
    (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  try {
    await setClient.set("current_epoch", epochInfo.epoch);
    await setClient.set(
      "epoch_completion_percent",
      Math.round(epoch_completed_percent)
    );
    console.log(`Set current_epoch to ${epochInfo.epoch}`);
    console.log(
      `Set epoch_completion_percent to ${Math.round(epoch_completed_percent)}`
    );
  } catch (err) {
    console.error("Error setting epoch data in Redis:", err);
  }

  // check if exists in mongo
  const db = client.db("lottos");
  const collection = db.collection("rounds");
  const round = await collection.findOne({ epoch: epochInfo.epoch });
  if (!round) {
    console.log("No round found, creating new round");
    // create new round in db
    console.log("Taking snapshot of token holders");
    const players = await takeSnapshot();
    console.log("Inserting new round into database");
    await insertNewRound(epochInfo.epoch, players);
  }

  // Subscribe to the keyspace notifications for the specified key
  console.log("Subscribing to keyspace notifications");
  subClient.subscribe(channel, (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(
        `Subscribed successfully! Monitoring changes to key: ${keyToMonitor}`
      );
    }
  });

  console.log("Starting job processing");
  // Process jobs in the queue
  jobQueue.process(async (job) => {
    try {
      console.log(`Processing job with id ${job.id}`);
      // Add your job processing logic here
      // For example, you can call a function to handle the job
      await handleJob(job.data);
      console.log(`Job with id ${job.id} completed successfully`);
    } catch (error) {
      console.error(`Job with id ${job.id} failed: ${error.message}`);
    }
  });
  async function handleJob(data: JobData) {
    // Implement your job handling logic here
    console.log("Handling job with data:", data);

    if (data.type === "epochCheck") {
      console.log("This is an epoch check job");
      // get current epoch from solana and completition percentage
      const epochInfo: EpochInfo = await connection.getEpochInfo();
      console.log("Epoch Info: ", epochInfo);
      let epoch_completed_percent =
        (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;

      try {
        await setClient.set("current_epoch", epochInfo.epoch);
        await setClient.set(
          "epoch_completion_percent",
          Math.round(epoch_completed_percent)
        );
        console.log(`Set current_epoch to ${epochInfo.epoch}`);
        console.log(
          `Set epoch_completion_percent to ${Math.round(
            epoch_completed_percent
          )}`
        );
      } catch (err) {
        console.error("Error setting epoch data in Redis:", err);
      }

      // compare to current epoch in db
      // if current epoch is greater than db then epoch is over
      // Update the db with the new epoch - this triggers a pull winner job
    }

    if (data.type === "webhookEvent") {
      const epoch_completed_percent = await getClient.get(
        "epoch_completed_percent"
      );
      const points_multiplier = Number(epoch_completed_percent) * 100;
      console.log("This is a webhook event job");
      for (const event of data.data) {
        console.log("owner:", event.accountOwner);
        console.log("amount:", event.amount);
        if (event.amount > 0) {
          console.log("pointsAdded");
          const points = event.amount * points_multiplier;
          console.log("points:", points);
          // TO DO add points to user in db
        } else {
          console.log("pointsSubtracted");
          const points = event.amount;
          console.log("points:", points);
          // TO DO subtract points from user in db
        }
      }
    }
  }
}

startQueue();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Closing Redis connections...");
  subClient.quit();
  getClient.quit();
  process.exit();
});

// Repeating Job Enqueuer
// (async () => {
//   console.log("Enqueuing init job");
//   await jobQueue.add("jobQueue", { type: "init" }, {lifo: true});
// })();

// every 5 minutes send a epoch job to the queue
setInterval(async () => {
  console.log("Enqueuing epochCheck job");
  await jobQueue.add("jobQueue", { type: "epochCheck" });
}, 1000);

console.log("Queue worker is running...");
