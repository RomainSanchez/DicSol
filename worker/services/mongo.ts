import { MongoClient } from "mongodb";
import { Round } from "../types";


export class MongoService {
  private rounds;
  
  constructor() {
    const client = new MongoClient(process.env.MONGO!);
    const db = client.db("lottos");
    this.rounds = db.collection("rounds"); 
  }

  async getRound(epoch: number) {
    return await this.rounds.findOne({ epoch: epoch });
  }

  async createRound(round: Round) {
    await this.rounds.insertOne(round);
  }

  async updateRound(round: any) {
    round.updatedAt = new Date();
  
    await this.rounds.updateOne({ _id: round._id }, {$set: round}) 
  }

}