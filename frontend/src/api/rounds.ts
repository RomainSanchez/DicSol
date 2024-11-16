import type { Round } from '../types/lottery'

const API_URL = 'https://api.dicsol.xyz/rounds'

export async function fetchRounds(): Promise<Round[]> {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching rounds:', error)
    throw error
  }
}