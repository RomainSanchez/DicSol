import { AccountLayout } from "@solana/spl-token";
import schedule from 'node-schedule';
import { Round, Epoch, Player, Ticket } from "./types"
import { RewardsService } from "./services/rewards";
import { SolanaService } from "./services/solana";
import { MongoService } from "./services/mongo";

const mongoService = new MongoService();
const rewardsService = new RewardsService();
const solanaService = new SolanaService();

async function run() {
  const epoch: Epoch = await solanaService.getCurrentEpoch()
  const players: Player[] =  await getPlayers(epoch);
  
  let round = await mongoService.getRound(epoch.number);

  const previousRound = await mongoService.getRound(epoch.number - 1);

  // Try to end round everytime in case of failed tx
  if(previousRound) {
    await endRound(previousRound);
  }

  if (!round) {

    await startRound(epoch.number, players, previousRound)

    round = await mongoService.getRound(epoch.number)
  } else {
    players.forEach((newPlayer: Player) => {
      const existingPlayer = round?.players.find((player: Player) => player.address === newPlayer.address);
  
      if (existingPlayer) {
          existingPlayer.oldBalance = existingPlayer.balance;
          existingPlayer.balance = newPlayer.balance;
      } else {
          round?.players.push(newPlayer);
      }
    });

    round.players = await updateScores(epoch.progress, round.players);

    mongoService.updateRound(round);
  }
}

async function startRound(epoch: number, players: Array<Player>, previousRound: any) {
  console.log('CREATE ROUND')
  const hadWinner = previousRound && previousRound.tx ? true: false

  const pot = await getJackpot(epoch - 1, hadWinner ? null : previousRound?.pot);
  const odds = await getOdds(previousRound?.odds, hadWinner);

  const round: Round = {
    epoch,
    winner: null,
    players,
    pot,
    odds,
    tx: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ended: false,
  };

  return await mongoService.createRound(round);
}

async function endRound(round: any) {
  if(!round.winner) {
    round.winner = pullWinner(round.players, round.pot, round.odds);
  }

  if(round.winner) {
    if(!round.tx) {
      round.tx = await solanaService.sendTransaction(round.winner, round.pot);

      round.ended = true;

      await mongoService.updateRound(round);
    }
  }
}

async function updateScores(epochProgress: number, players: Player[]) {
  players.forEach((player: Player) => {
    if(player.balance < 1) {
      if(player.exitedAt == 0) {
        player.exitedAt = epochProgress;
      }

      if(player.oldBalance > 1) {
        player.score = player.exitedAt - player.enteredAt;
      } else {
        player.score = 0;
      }
    } else {
      const newScore = 100 - epochProgress;

      if(player.score < newScore) {
        player.score = newScore;
      }
    }
  })
 
  return players;
}

function pullWinner(players: Player[], pot: number, odds: number): string|null {
  console.log('PULL WINNER')
  const eligiblePlayers = players.filter((player: Player) => player.score > 50);
  const tickets: Ticket [] = getTickets(eligiblePlayers);

  console.log(`${tickets.length} tickets`)

  const getRandomNumber = (min: number, max: number) => {
     return Math.round(Math.random() * (max - min) + min);
  }

  const winningTicket = tickets[getRandomNumber(0, tickets.length -1)];
  console.log('Ticket: ', winningTicket);  
  const hitsJackpot = getRandomNumber(0, 100) <= odds;
  console.log(`JACKPOT: ${hitsJackpot}`);

  if(hitsJackpot) {
    return winningTicket.owner;
  }

  return null
}

function getTickets(players: Player[]): Ticket[] {
  const tickets: Ticket [] = [];
  let currentTicketNumber = 0

  players.forEach((player: Player) => {
    let ticketAmount = player.score;

    if(player.balance > 10) {
      ticketAmount = ticketAmount * 1.5; 
    } else if (player.balance > 20) {
      ticketAmount = ticketAmount * 2
    } else if (player.balance > 50) {
      ticketAmount = ticketAmount * 3
    }

    for (let i = 0; i < ticketAmount; i++) {
      const ticket = {
        owner: player.address,
        number: currentTicketNumber
      }

      tickets.push(ticket);
    
      currentTicketNumber++;
    }
  })

  return tickets;
}

async function getPlayers(epoch: Epoch): Promise<Player[]> {
  console.log('GET PLAYERS')

  const excludedPlayers = process.env.EXCLUDE!.split(' ');
  const accounts =  await solanaService.getTokenAccounts(epoch)

  const players = accounts
    .map((account: any) => {
      const accountData = AccountLayout.decode(account.account.data);

      let player: Player = {
        wallet: accountData.owner.toString(),
        address: account.pubkey.toString(),
        oldBalance: 0,
        balance: Number(accountData.amount) / (10 ** 9),
        enteredAt: epoch.progress,
        exitedAt: 0,
        score: 0
      };

      return player
    })
    .filter((player: Player) => player.balance > 0 && !excludedPlayers.includes(player.address) && !excludedPlayers.includes(player.wallet));

  return players;
}

async function getJackpot(epoch: number, previousPot: number|null ): Promise<number> {
  const rewards = await rewardsService.getRewards(epoch);
  
  let pot: number = (rewards / 3.5)

  if(previousPot) {
    pot += previousPot;
  }

  if(process.env.BONUS) {
    const bonus = Number(process.env.BONUS);

    if(bonus > 0) {
      pot += bonus;
    }
  }

  return Number(pot.toFixed(9));
}

async function getOdds(previousOdds: number | null, hadWinner: boolean) {
  if (!previousOdds || previousOdds == 100 || hadWinner) {
    return 10;
  }

  return previousOdds + 10;
  
}


// every hour '0 * * * *'
// every 30 seconds '*/30 * * * * *'
const job = schedule.scheduleJob(process.env.CRON!, async () => {
  run()
});
