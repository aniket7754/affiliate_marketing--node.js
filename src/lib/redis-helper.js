/* eslint-env node */
/**
 * Summary: Wrapper around redis for better control.
 */
const DEBUG = require("./debugger")("lib-redis-helper");
const REDIS_CLIENT = require("../connection/redisConnection").getClient;

function set(client, key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, typeof value === "string" ? value : JSON.stringify(value), (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function addKeyInToSet(key, value) {
  const functionName = "addKeyInToSet";
  return new Promise((resolve, reject) => {
    DEBUG(functionName, key, value);
    REDIS_CLIENT()
      .then((client) => {
        this.client = client;
        return set(this.client, key, value);
      })
      .then((result) => {
        DEBUG(`${functionName} success`, result);
        resolve(result);
      })
      .catch((error) => {
        DEBUG(`${functionName} failure`, error);
        reject(error);
      });
  });
}

module.exports = {
  addKeyInToSet,
};
