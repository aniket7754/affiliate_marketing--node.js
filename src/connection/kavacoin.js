/* eslint-env node */
function newConnection(){
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE
	});

	try{
		con.connect(function(err) {
			if (err) {console.log(err); return false;}
			console.log("Connected to database!");
		});
	}
	catch(err){
		console.log(err);
		return false;
	}
	return con;
}

function mongo_new_connection() {
	var conn = require('mongodb').MongoClient;
	host = process.env.MONGO_HOST,
	user = process.env.MONGO_USERNAME,
	password = process.env.MONGO_PASSWORD,
	conn.connect(("mongodb://"+user+":"+password+"@"+host+"/"), {useNewUrlParser: true}, (error, result) =>{
        if(error){
        	console.log(error)
        }
        database = result.db("API_data")
        console.log("Connection Successfull !!")
    })
}

// function redis_connection() {
// 	var redis = require('redis');
// 	const client = redis.createClient();
// 	client.on("error", function(error){
//     	console.error("Error encountered: ", error);
// 	})
// 	client.on("connect", function(error){
//     	console.log("Redis Connected !!");
// 	})
// }

module.exports = {conn: newConnection(),con: mongo_new_connection()}



// MongoClient: mongo_new_connection()