import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
const client = createClient({ url: process.env.REDIS_URL });
client.on('connect', () => {
    console.log('Connected to Redis server');
});
client.on('error', (err) => console.log('Redis Client Error', err));
//await client.connect()
(async () => {
    await client.connect();
})();
export default client;
/*import Redis from "ioredis"

const client = new Redis(process.env.REDIS_URL)

client.on('connect', () => {
  console.log('Connected to Redis server');
});

client.on('error', (err) => {
  console.error(`Error connecting to Redis server: ${err}`);
});

export default client;*/
