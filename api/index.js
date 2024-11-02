const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routes')
const path = require('path')
const http = require('http')
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json())

// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log('MongoDB database Connected...'))
//     .catch((err) => console.log(err))

app.use('/api/', routes)

app.get('/', (req, res) => {
    res.send('What are you doing there fucker')
})

var httpServer = http.createServer(app);

httpServer.listen(process.env.PORT);