import { Connection, clusterApiUrl } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { getCurrentLotto } from '@/app/lib/mongodb/client';

const connection = new Connection(clusterApiUrl('mainnet-beta'));

async function getCurrentEpoch() {
  const epochInfo = await connection.getEpochInfo();
  return epochInfo.epoch;
}

export async function GET() {
  try {
    const currentEpoch = await getCurrentEpoch();
    const currentLotto = await getCurrentLotto(currentEpoch);

    return NextResponse.json({ epoch: currentEpoch, currentLotto });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch raffles' });
  }
}
