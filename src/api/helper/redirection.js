const express = require('express')
const request = require('request')
const MongoClient = require('mongodb').MongoClient
const app = express()
app.use(express.json())

function get_link(res, platform, network, offer_id, country) {
    MongoClient.connect(("mongodb://admin:SaVaTaRR@18.223.2.248:27017/"), {useNewUrlParser: true}, (error, result) =>{
        if(error){
            console.log(error)
        }
        var database = result.db("API_data")
    database.collection(network).find({"offer_id":offer_id, "country": country},{ projection: { _id: 0, Insert_time: 0, country: 0, payout: 0 } }).toArray(function(err, result) {
        if (err) throw err;
        if (result[0].package_name.includes(".")){
            platform_data = "Android"  
        }else{
            platform_data = "Apple"
        }
        // console.log(result[0].network_name)
        // console.log(result[0].offer_id)
        var valid_name = "Valid" + "_" + result[0].network_name + "_" + result[0].offer_id
        var not_valid_name = "Not_Valid" + "_" + result[0].network_name + "_" + result[0].offer_id
        // console.log(platform_data)
        // console.log(result[0].package_name);
        // console.log(result[0].click_url);
        request({url: "https://www.trackip.net/ip?json", json: true}, (err, response, body) => {
            console.log(body["Country"]);
            var redis = require('redis');
            const client = redis.createClient();
            let count_client = 0;
            let count_self = 0;
            // console.log(count_client)
            if ((country == body["Country"]) && (platform == platform_data)){
                var data_client = client.get(valid_name, function(err, reply) {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(reply)
                        const a = ++reply
                        client.set(valid_name, a)
                        console.log("Valid user")
                        res.redirect(result[0].click_url)
                    }
                })
            }else{
                var data_self = client.get(not_valid_name, function(err, reply) {
                    if(err){
                        console.log(err)
                    }else{
                        const b = ++reply
                        client.set(not_valid_name, b)
                        res.send("can't redirect the link")
                    }
                })
            }
        })
    })
})
}

module.exports = {
    get_link
}