/* eslint-env node */
/**
 * Summary: create connections
 */
require('dotenv').config();
var kavacoin = require('./kavacoin');
var con = kavacoin.conn

module.exports = { con: con};

// console.log(con);