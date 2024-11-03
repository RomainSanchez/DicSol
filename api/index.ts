import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Request, Response } from "express";
import dotenv from "dotenv";

const routes = require('./routes')

dotenv.config();

const app = express()

const options: cors.CorsOptions = {
  origin: process.env.CORS!.split(' ')
};

app.use(cors(options));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(process.env.PORT!, () => { 
  console.log("Server running at PORT: ", process.env.PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});