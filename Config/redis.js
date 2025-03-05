const redis = require('redis');

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect().then(() => console.log('Redis Connected')).catch(console.error);

module.exports = client;
