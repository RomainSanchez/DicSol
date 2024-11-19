export interface Player {
  wallet: string
  address: string
  balance: number
  score: number
  enteredAt: number
  exitedAt: number
}

export interface Round {
  _id: string
  epoch: number
  winner: string | null
  players: Player[]
  pot: number
  ended: boolean
  createdAt: string
  tx: string | null
}

export interface SortBy {
  key: string
  order: 'asc' | 'desc'
}