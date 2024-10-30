import { NextRequest, NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

import Bull from 'bull';

// const uri = "mongodb+srv://banana:PuG1cd4tybUMghBj@cluster0.hoysqgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const client = new MongoClient(uri);

const jobQueue = new Bull('jobQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

  

    await jobQueue.add({ type: 'webhookEvent', data });

    return NextResponse.json({ message: 'Webhook data inserted successfully' });
  } catch (error) {
    console.error('Error inserting webhook data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }

  // Connect to the MongoDB client
  //   await client.connect();
  //   const db = client.db("your_database_name");
  //   const collection = db.collection("webhooks");

  //   // Insert the parsed webhook data into the collection
  //   const result = await collection.insertOne(data);

  //   return NextResponse.json({ message: 'Webhook data inserted successfully', result });
  // } catch (error) {
  //   console.error('Error inserting webhook data:', error);
  //   return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  // } finally {
  //   // Ensure the client will close when you finish/error
  //   await client.close();
  // }
}

