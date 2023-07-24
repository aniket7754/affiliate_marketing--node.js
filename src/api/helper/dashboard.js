const { json } = require("body-parser");

const jwt = require("jsonwebtoken");
const con = require("../../connection/index").con;
const { exec } = require('child_process');
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
app.use(express.json())
function GetHomepageReports(res, required, start_date, end_date) {
  query_map = []
  required = required.trim();
  // console.log(required)

  MongoClient.connect(("mongodb://abhinav:Savatarr!1122@dashboard-api.savatarr.tech:27017/"), { useNewUrlParser: true }, (error, result) => {
    if (error) {
      console.log(error)
    }
    var db = result.db("publisherData");
    // var collection = db.collection("click_record");
    var query = {}
    if (required == 'clicks') {
      var options = {
        allowDiskUse: true
      };

      var pipeline = [
        {
          "$match": {
            "date": { "$gte": start_date, "$lte": end_date }
          }

        },
        {
          "$group": {
            "_id": {},
            "COUNT(*)": {
              "$sum": 1
            },
            "payout": { "$sum": "$payout" }

          }
        },
        {
          "$project": {
            "payout": "$payout",
            "clicks": "$COUNT(*)",
            "_id": 0
          }
        }
      ];

      db.collection("click_record").aggregate(pipeline, options).toArray((err, result) => {
        if (err) throw err
        console.log(result[0])
        // const sum = result[0].payout;
        responseData = { 'code': 200, 'response': result };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).send(JSON.stringify(responseData));
      })


    }
    else if (required == 'conversion') {
      var options = {
        allowDiskUse: true
      };

      var pipeline = [
        {
          "$match": {
            "date": { "$gte": start_date, "$lte": end_date }
          }

        },
        {
          "$group": {
            "_id": {},
            "COUNT(*)": {
              "$sum": 1
            }
          }
        },
        {
          "$project": {
            "conversions": "$COUNT(*)",
            "_id": 0
          }
        }
      ];

      db.collection("postback").aggregate(pipeline, options).toArray((err, result) => {
        if (err) throw err
        responseData = { 'code': 200, 'response': result };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).send(JSON.stringify(responseData));
      })
    }


    else if (required == "total_offers") {
      query = "SELECT COUNT(serial) as 'total_offers' from all_offers where `createdAt`>='" + start_date + "' AND `createdAt`<='" + end_date + "'";
      con.query(query, function (err, result) {
        if (err) {
          console.log(err);
          const responseData = { 'code': 500, 'response': err };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else {
          responseData = { 'code': 200, 'response': result };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          console.log(result)
        }
      });
    }
    else if (required == "top_5_campaigns") {
      var options = {
        allowDiskUse: true
      };
      var pipeline = [
        {
          "$match": {
            "date": { "$gte": start_date, "$lte": end_date }
          }

        },
        {
          "$lookup": {
            "from": "postback",
            "localField": "click_id",
            "foreignField": "click_id",
            "as": "click_record_join"
          }
        },
        {
          "$group": {
            _id: "$offer_name",
            payout:{"$sum":"$payout"},
            conversions: { "$sum": { "$size": "$click_record_join" } }
          }
        },
        {
          "$sort": { count: -1 }
        },
        {
          "$limit": 5
        }
      ]
      db.collection("click_record").aggregate(pipeline, options).toArray((err, result) => {
        if (err) throw err

        responseData = { 'code': 200, 'response': result };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).send(JSON.stringify(responseData));
      })

    }
    else if (required == "top_5_country") {
      var options = {
        allowDiskUse: true
      };
      var pipeline = [
        {
          "$match": {
            "date": { "$gte": start_date, "$lte": end_date }
          }

        },
        {
          "$lookup": {
            "from": "postback",
            "localField": "click_id",
            "foreignField": "click_id",
            "as": "click_record_join"
          }
        },
        {

          "$group": {
            "_id": "$country",
            "count": { "$sum": 1 },
            "payout": { $sum: "$payout" },
            "conversions": { "$sum": { "$size": "$click_record_join" } },
          }
        },
        {
          "$sort": { "count": -1 }
        },
        {
          "$limit": 5
        }
      ]
      db.collection("click_record").aggregate(pipeline, options).toArray((err, result) => {
        if (err) throw err



        responseData = { 'code': 200, 'response': result };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).send(JSON.stringify(responseData));
      })

    }
    else if (required == "trending_offers") {
      var query = "SELECT * from trending_offers limit 10";
      con.query(query, function (err, result) {
        if (err) {
          console.log(err);
          const responseData = { 'code': 500, 'response': err };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else {
          responseData = { 'code': 200, 'response': result };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          console.log(result)
        }
      });
    }

  });

}
function profile(res,username){
  var query="select * from user_profile where `username`='"+username+"'";
  con.query(query, function (err, result) {
    if (err) {
      console.log(err);
      const responseData = { 'code': 500, 'response': err };
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).send(JSON.stringify(responseData));
      res.end();
    }
    else {
      responseData = { 'code': 200, 'response': result };
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(JSON.stringify(responseData));
      console.log(result)
    }
  });
}

function settings(res, username, company, job, country, address,phone,email,skype_link,thumbnail,exist_name){
  var query = "UPDATE user_profile SET username='" + username + "',company='" + company + "',email='" + email + "',job='" + job + "',country='" + country + "',address='" + address + "',phone='" + phone + "',skype_link='" + skype_link + "',thumbnail='" + thumbnail + "' WHERE username ='" + exist_name + "'";
  con.query(query, function (err, result) {
    if (err) {
      console.log(err);
      const responseData = { 'code': 500, 'response': err };
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).send(JSON.stringify(responseData));
      res.end();
    }
    else {
      responseData = { 'code': 200, 'response': "updated" };
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(JSON.stringify(responseData));
      res.end();
    }
  });

}
function commitQuery(query) {
  if (!con) {
    console.log("Could not connect to campEngine!");
  }
  else {
    console.log(query);
    con.query(query, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Query Success!");
      }
    });
  }
}


module.exports = {
  GetHomepageReports,
  profile,
  settings
}
