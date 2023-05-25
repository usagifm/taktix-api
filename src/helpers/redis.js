const redis = require('redis');

var redisClient

(async () => {
    redisClient = redis.createClient(
        {
            url: process.env.REDIS_URL
        }
    );

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

export default redisClient