import axios from 'axios';
import { JitoReward } from '../types';

export class RewardsService {
  private readonly baseUrl = 'https://kobe.mainnet.jito.network/api/v1/';
  
  async getRewards(epoch: number): Promise<any> {
    try {
      const response = await axios.get<JitoReward[]>(
        `${this.baseUrl}/validators/${process.env.VALIDATOR_ADDRESS!}`
      );

      const reward = response.data.find(r => Number(r.epoch) == epoch)!;


      return (reward.mev_rewards / (10 ** 9)) * (Number(reward.mev_commission_bps) / 10000);

    } catch (error) {
      console.log(error);
    }
  }
}

// const rewards = await connection.getInflationReward([new PublicKey(process.env.VALIDATOR_ADDRESS!)], epoch); 

// if (rewards && rewards[0]) {
//   return rewards[0].amount / (10 ** 9)
// }
