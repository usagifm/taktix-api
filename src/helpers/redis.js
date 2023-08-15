const redis = require('redis');

var redisClient

(async () => {
    redisClient = redis.createClient(
        {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDISPASSWORD
        }
    );

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

export default redisClient