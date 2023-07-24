const redis = require("redis");
const express = require('express')
const util = require("util")

// const redisConf = {
//     host: "localhost",
//     port: "6379",
//     pass: "....."
// }
// If we are giving blank in creatreclient, then it is accessing the localhost, and if we want to access with anyother server/pass , then we have to put inside the bracket
const client = redis.createClient();  
const app = express();
client.set = util.promisify(client.set)
client.get = util.promisify(client.get)

app.use(express.json())

client.on("error", function(error){
    console.error("Error encountered: ", error);
})
client.on("connect", function(error){
    console.log("Redis Connected !!");
})

// client.set("first_name","ankit")
// client.set("last_name","bhatt")

// Posting data using api in redis database.....
// app.post("/post", async(req, res) => {
//     const key = req.body.key;
//     const value = req.body.value;
//     const response = await client.set(key, value)
//     if (response){
//         res.send("Done")
//     }else{
//         res.send("Not done")
//     }
// })

// // Getting data from redis database....
// app.get("/get", async(req, res) => {
//     const key = req.body.key;
//     const response = await client.get(key)
//     if (response){
//         res.send(response)
//     }else{
//         res.send("Can't access the value")
//     }
// })


// app.listen(8080, () =>{
//     console.log("Port is running at 8080")
// })