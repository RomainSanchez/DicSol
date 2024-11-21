export interface Epoch{
  number: number;
  progress: number
}

export interface Player {
  address: string;
  wallet: string;
  enteredAt: number;
  exitedAt: number;
  oldBalance: number;
  balance: number;
  score: number;
}

export interface Round {
  epoch: number
  winner: string|null;
  players: Player[];
  pot: number;
  odds: number;
  tx: string|null;
  createdAt: Date;
  updatedAt: Date;
  ended: boolean;
}

export interface Ticket {
  owner: string;
  number: number;
}

export interface JitoReward {
  epoch: number;
  mev_commission_bps: number;
  mev_rewards: number;
}