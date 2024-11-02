const { Router } = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO);


const router = Router()

router.get('/rounds', async (req, res) => {
    
    try {
        const db = client.db("lottos");
        const collection = db.collection("rounds");

        const rounds = await collection.find({}).sort({_id:1}).limit(20).toArray();

        res.status(200).json(rounds)
    } catch (error) {
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