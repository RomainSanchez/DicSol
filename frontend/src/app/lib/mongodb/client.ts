import { MongoClient, ServerApiVersion } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


export async function getCurrentLotto(epoch: number) {
    const db = client.db('lottos');
    const collection = db.collection('rounds');
    const currentLotto = await collection.findOne({ epoch: epoch });
    return currentLotto;
  }