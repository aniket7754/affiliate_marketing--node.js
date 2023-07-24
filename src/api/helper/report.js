const jwt = require("jsonwebtoken");
const con = require("../../connection/index").con;
const { exec } = require('child_process');
const express = require('express');
const { off } = require("process");
const MongoClient = require('mongodb').MongoClient
const app = express()
app.use(express.json())

function report(res, groupBy, start_date, end_date,filters) {
    // var mongodb = require("mongodb");
    // console.log(groupBy)
    // var client = mongodb.MongoClient;
    // var url = "mongodb://host:port/";

    MongoClient.connect(("mongodb://abhinav:Savatarr!1122@dashboard-api.savatarr.tech:27017/"), { useNewUrlParser: true }, (error, dbo) => {
        if (error) {
            console.log(error)
        }
        var db = dbo.db("publisherData");
        // var collection = db.collection("click_record");
        // let dateFilter = {"date": {"$gte": start_date, "$lte": end_date}}; 
        // console.log(dateFilter)
        var query = { $and: [{"date": {"$gte": start_date, "$lte": end_date}}] };
        if(filters){
          Object.keys(filters).forEach(key => {
            if(key === 'groupBy'||key === 'start_date'||key === 'end_date'){
                return;
            }
           else {
                let filter = {};
                filter[key] = filters[key];
                query.$and.push(filter);
            }
        });
        }
       
      // query.$and.push(dateFilter);
      
      // query.$and.push({"date": {"$gte": start_date, "$lte": end_date}})

        console.log(query)
        db.collection("click_record").find(query).toArray((err, result) => {
            if (err) throw err
            var grouped_data = {}
            var payout_list = {}
            var payout = []
            var click_id_wise_data = {}
            // console.log(result)
            result.forEach(doc => {
                click_id_wise_data[doc.click_id] = doc
            });
            db.collection("postback").find({ "click_id": { "$in": Object.keys(click_id_wise_data) } }).toArray((err, result) => {
                if (err) throw err
                // console.log(result)
                result.forEach(doc_pb => {
                    if (click_id_wise_data[doc_pb.click_id] !== undefined) {
                        click_id_wise_data[doc_pb.click_id]['converted'] = 1
                    }
                    else {
                        click_id_wise_data[doc_pb.click_id] = { 'converted': 1 }
                    }

                });
                var document = {}
                for (const d in click_id_wise_data) {
                    document = click_id_wise_data[d]
                    var key = ""
                    groupBy.forEach(field => {
                        // console.log(document)
                        // console.log(field)
                        key += document[field] + "__"

                    });
                    if (grouped_data[key] == undefined) {
                        grouped_data[key] = {};
                    }
                    if (grouped_data[key]['clicks'] !== undefined) {
                        grouped_data[key]['clicks'] = grouped_data[key]['clicks'] + 1;
                    }
                    else {
                        grouped_data[key]['clicks'] = 1;
                    }
                    if (document.converted) {
                        if (grouped_data[key]['conversions'] !== undefined) {
                            grouped_data[key]['conversions'] = grouped_data[key]['conversions'] + 1;
                        }
                        else {
                            grouped_data[key]['conversions'] = 1;
                        }
                        if (grouped_data[key]['revenue'] !== undefined) {
                            grouped_data[key]['revenue'] = (grouped_data[key]['revenue']) + ((grouped_data[key]['revenue']) * parseFloat(document.payout));
                        }
                        else {
                            grouped_data[key]['revenue'] = parseFloat(document.payout);
                        }
                    }
                };
            // console.log(grouped_data[key]['conversion'])
                res.send(grouped_data)
            // dbo.close;



        })
        // res.send(grouped_data)

    })
});


}

function postback(res,company){
    var query="SELECT * from postback where `publisher_name`='"+company+"'";
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

function request(res,offer_id,company){
    var query_1="select `applied_for_pubs` from `all_offers` where `offer_id`='"+offer_id+"'";
    con.query(query_1, function (err, result) {
      if (err) {
        console.log(err);
        const responseData = { 'code': 500, 'response': err };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(500).send(JSON.stringify(responseData));
        res.end();
      }
      else {
        result.forEach(row => {
          if((row.applied_for_pubs).indexOf(company)!==-1){
            responseData = { 'code': 200, 'response': "Already requested" };
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).send(JSON.stringify(responseData));
        console.log(result)
          }
          else{
            var query="Update `all_offers` SET `applied_for_pubs`=CONCAT(`applied_for_pubs`,'"+company+"',',') where `offer_id`='"+offer_id+"'";

    con.query(query, function (err, result) {
        if (err) {
          console.log(err);
          const responseData = { 'code': 500, 'response': err };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else {
          
    
          responseData = { 'code': 200, 'response': "Requested" };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          console.log(result)
        }
      });
            
          }
        
        
        });
          
  
        
      }
    });
    
    
}

function update_post(res,name,exist_name,type,postback,parameters){
    var query="UPDATE `postback` set `name`='"+name+"',`type`='"+type+"',`global_postback`='"+postback+"',`parameters`='"+parameters+"' WHERE `name`='"+exist_name+"'"
    con.query(query, function (err, result) {
        if (err) {
          console.log(err);
          const responseData = { 'code': 500, 'response': err };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
        else {
          responseData = { 'code': 200, 'response': "Updated" };
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          console.log(result)
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

function invoice(res,publisher_name,start_date){
  var condition=""
  if(start_date){
    condition = " AND `date`='"+start_date+"'";
  }
  var query="SELECT * FROM `invoice` WHERE `publisher_name`='"+publisher_name+"'"+condition+"";
  con.query(query, function (err, result) {
    if (err) {
      console.log(err);
      const responseData = { 'code': 500, 'response': err };
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).send(JSON.stringify(responseData));
      res.end();
    }
    else {
      responseData = { 'code': 200, 'response': result};
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(JSON.stringify(responseData));
      console.log(result)
    }
  });
}
module.exports = {
    report,
    postback,
    request,
    update_post,
    invoice
}