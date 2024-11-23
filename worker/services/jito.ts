import axios from 'axios';
import { JitoReward } from '../types';

export class JitoService {
  private readonly baseUrl = 'https://kobe.mainnet.jito.network/api/v1/';
  
  async getRewards(epoch: number): Promise<any> {
    try {
      const response = await axios.get<JitoReward[]>(
        `${this.baseUrl}/validators/${process.env.VALIDATOR_ADDRESS!}`
      );

      const reward = response.data.find((r: JitoReward) => Number(r.epoch) == epoch)!;

      console.log('Jito: ', reward);
      return (reward.mev_rewards / (10 ** 9)) * (Number(reward.mev_commission_bps) / 10000);

    } catch (error) {
      console.log('Jito API: ', error);
    }
  }
}
