/* eslint-env node */
/**
 * Summary: App server code is here
 */

const EXPRESS = require("express");
const UTIL = require("util");

const APP = EXPRESS();
const CONFIG_INIT = require("./configInit");

const cors = require('cors'); 
APP.use(cors());
// APP.options('*', cors());

let isRunning = false;
let isTaskStarted = false;

function runApp() {
  const { PORT } = process.env;
  APP.listen(PORT, (error) => {
    if (!error) {
      isRunning = true;
      UTIL.log("APP is running on", PORT);
    } else {
      UTIL.error("Error while running the app", error);
    }
  });
}

function run() {
  if (!isRunning && !isTaskStarted) {
    isTaskStarted = true;
    CONFIG_INIT(APP)
      .then(runApp)
      .catch((error) => {
        UTIL.error(error);
        process.exit(1);
      });
  } else {
    UTIL.log("APP is already running on PORT:", process.env.PORT);
  }
}

module.exports = {
  run,
};
