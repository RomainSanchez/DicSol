import { Connection, clusterApiUrl } from '@solana/web3.js';
import { NextResponse } from 'next/server';

const connection = new Connection(clusterApiUrl('mainnet-beta'));

async function getCurrentEpoch() {
  const epochInfo = await connection.getEpochInfo();
  return epochInfo.epoch;
}

async function getRafflesForEpoch(epoch: number) {
  // This is a placeholder function. Replace it with the actual logic to get raffles for a given epoch.
  return [`Raffle for epoch ${epoch}`];
}

export async function GET() {
  try {
    const currentEpoch = await getCurrentEpoch();
    const raffles = [];

    for (let i = 1; i < 11; i++) {
      const epochRaffles = await getRafflesForEpoch(currentEpoch - i);
      raffles.push(...epochRaffles);
    }

    return NextResponse.json({ epoch: currentEpoch, raffles });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch raffles' });
  }
}
