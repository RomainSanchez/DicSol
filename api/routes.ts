
import { Request, Response } from "express";
import { Router } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO
const client = new MongoClient(mongoUrl ? mongoUrl: '');

const router = Router()

router.get('/rounds', async (req: Request, res: Response) => {
    
    try {
        const db = client.db("lottos");
        const collection = db.collection("rounds");

        const rounds = await collection.find({}).sort({_id:1}).limit(20).toArray();

        res.status(200).json(rounds)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// router.get('/round/:id', async (req, res) => {
//     const { name } = req.params

//     try {
//         const degen = await Degen.findOne({name: name})
//         if (!degen) throw Error('Something went wrong ')
//         res.status(200).json(degen)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

module.exports = router