const { query } = require('express');
const moment = require('moment');
const { off } = require('process');
const con = require("../../connection/index").con;
var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=e;d.setDate(d.getDate()+1)){ a.push(moment(new Date(d)).format('YYYY-MM-DD').toString());}return a;};


function all_offersReport(res,username, condition){
    var query="SELECT * FROM `all_offers` WHERE `username` = '"+username+"' "+condition+"";
    console.log(query)
    if (!con){
      console.log("Could not connect to New ClickManager!");
      const responseData = {'code':500, 'response': 'Could not connect to New ClickManager!'};
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).send(JSON.stringify(responseData));
      res.end();
    }
    else{
      con.query(query, function (err, result) {
        console.log(result)
        if (err){
          console.log(err);
          const responseData = {'code':500, 'response': err};
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else{
          
          responseData = {'code':200, 'response': result};
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          res.end();
        }
      });
    }
  
  }

  function tracking(res,offer_id){
    var query="SELECT * FROM `all_offers` WHERE `offer_id` = '"+offer_id+"'";
    console.log(query)
    if (!con){
      console.log("Could not connect to New ClickManager!");
      const responseData = {'code':500, 'response': 'Could not connect to New ClickManager!'};
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).send(JSON.stringify(responseData));
      res.end();
    }
    else{
      con.query(query, function (err, result) {
        if (err){
          console.log(err);
          const responseData = {'code':500, 'response': err};
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else{
          const responseData = {'code':200, 'response': result};
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          res.end();
          
        }
      });
    }


  }

  module.exports = {
    all_offersReport,
    tracking
  }