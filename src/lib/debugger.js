/* eslint-env node */
/**
 * Summary: contain logic for debugging
 */
const DEBUG = require("debug");

function getDebugger(fileName) {
  return DEBUG(process.env.APP_NAME
    ? `${process.env.APP_NAME}::${fileName}`
    : `appanalytics-::${fileName}`);
}

module.exports = getDebugger;
