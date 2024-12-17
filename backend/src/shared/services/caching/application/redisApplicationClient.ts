import redis from 'redis';

const redisApplicationClient = redis.createClient({
  host: 'redis-19945.c275.us-east-1-4.ec2.cloud.redislabs.com:19945',
  password: 'GVrFlCdkuvcyFzmh7PptZIHve3NxjeXo',
});

redisApplicationClient.on('connect', () => {
  console.log('[Redis application client]: Connected to redis server');
});

export { redisApplicationClient };
