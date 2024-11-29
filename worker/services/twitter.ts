import { TwitterApi } from 'twitter-api-v2';
import { RateLimiter } from 'limiter';
// import pRetry from 'p-retry';
import fs from 'fs/promises';
import path from 'path';

export class TwitterService {
  private client: TwitterApi;
  private limiter: RateLimiter;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    this.limiter = new RateLimiter({
      tokensPerInterval: 50,
      interval: 'hour',
    });
  }

  private async postTweet(tweet: any) {
    const response = await this.client.v2.tweet(tweet);

    return response;
  };

  async postGifTweet(jackpot: number) {
    await this.limiter.removeTokens(1);

    const number = this.getRandomNumber(1, 6);

    const imageBuffer = await fs.readFile(`./assets/daa${number}.gif`);
    
    const mediaId = await this.client.v1.uploadMedia(imageBuffer, { mimeType: 'image/gif' });

    const text = 
    	`Fuck, OK!

			Someone hit the #dicSOL Jackpot of ${jackpot} sol

			Get dicSOL LST for your free tickets to the lottery at https://dicsol.xyz
			`
    ;
    const tweet = {
      text,
      media: { media_ids: [mediaId] },
    };


    const t = await this.postTweet(tweet);

    console.log(t)

    // return pRetry(postTweet, {
    //   retries: 3,
    //   onFailedAttempt: error => {
    //     console.warn(
    //       `Tweet posting attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
    //     );
    //   },
    // });
  }

  private getRandomNumber (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
}