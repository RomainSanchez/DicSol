import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Request, Response } from "express";

const routes = require('./routes')

const app = express()

const options: cors.CorsOptions = {
  origin: process.env.CORS!.split(' ')
};

app.use(cors(options));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(process.env.PORT!, () => { 
  console.log("Server running at PORT: ", process.env.PORT); 
}).on("error", (error: any) => {
  throw new Error(error.message);
});