/* eslint-env node */
/**
 * Summary: contain code for redis-client life cycle
 */
const REDIS = require("redis");

function getClient() {
  return new Promise((resolve, reject) => {
    const CLIENT = REDIS.createClient({
      url: process.env.REDIS_URL,
    });
    CLIENT.ping((error) => {
      if (error) return reject(error);
      return resolve(CLIENT);
    });
  });
}
function terminateClient(client) {
  return client.quit();
}

module.exports = {
  getClient,
  terminateClient,
};
