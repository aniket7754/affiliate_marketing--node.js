/* eslint-env node */
/**
 * Summary: Put dependency code in this file. By dependency I mean the code/config/connection that
 *  must get loaded before running the app
 */
const BODY_PARSER = require("body-parser");
const DOT_ENV = require("dotenv");
const FS = require("fs");

const API_ROUTES = require("./api/routes");
const CONNECTIONS = require("./connection");


function loadEnvVar() {
  return new Promise((resolve, reject) => {
    const RESULT = DOT_ENV.config();
    if (RESULT.error) reject(RESULT.error);
    else {
      resolve(true);
    }
  });
}


/**
 * This function is use to create all the directory specified in REQUIRED_DIR key in process.
 * You can add multiple directory in a "," separated form.
 */
function createRequiredDir() {
  return new Promise((resolve, reject) => {
    let error = null;
    if (process.env.REQUIRED_DIR) {
      // eslint-disable-next-line no-restricted-syntax
      for (let dirName of process.env.REQUIRED_DIR.split(",")) {
        try {
          dirName = dirName.trim();
          if (dirName && process.env[dirName]) {
            if (!FS.existsSync(dirName)) {
              FS.mkdirSync(dirName);
            }
          }
        } catch (innerError) {
          error = innerError;
          break;
        }
      }
    }
    if (error) return reject(error);
    return resolve();
  });
}

function loadPreRouteMiddlewares(appInstance) {
  return new Promise((resolve) => {
    appInstance.use(BODY_PARSER.urlencoded({
      extended: false,
    }));
    appInstance.use(BODY_PARSER.json());
    resolve(true);
  });
}


function loadRouters(appInstance) {
  return new Promise((resolve) => {
    API_ROUTES(appInstance);
    resolve(true);
  });
}


function loadDependencies(appInstance) {
  return new Promise((resolve, reject) => {
    loadEnvVar()
      .then(createRequiredDir)
      .then(CONNECTIONS.testConnection)
      .then(loadPreRouteMiddlewares(appInstance))
      .then(loadRouters(appInstance))
      .then(resolve)
      .catch(reject);
  });
}


module.exports = loadDependencies;
