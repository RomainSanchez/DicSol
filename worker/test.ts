import Redis from 'ioredis';

const redisConfig = {
  host: '127.0.0.1', 
  port: 6379,       
};

const redisClient = new Redis(redisConfig);

async function setCurrentEpoch(value: number) {
  try {
    await redisClient.set('current_epoch', value);
    console.log(`Set current_epoch to ${value}`);
  } catch (err) {
    console.error('Error setting current_epoch:', err);
  }
}

// Example usage
setCurrentEpoch(69);
