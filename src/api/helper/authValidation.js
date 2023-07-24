/* eslint-env node */
const jwt = require("jsonwebtoken");
const secretKey = "kavacoin123456";

const con = require("../../connection/index").con;
const fs = require('fs')
const { query } = require('express');
const moment = require('moment');
const { off } = require('process');
const { exec } = require('child_process')


function login(res, email,password) {
    // var responseData={}
    if(!(email&&password)){
        const responseData = {'code':500, 'response': 'All inputs are required'};
        res.header('Access-Control-Allow-Origin', '*');
        res.status(500).send(JSON.stringify(responseData));
        res.end();
    }
    var query = "SELECT `password` 'password' FROM `user_profile` WHERE `email` = '"+email+"'"; 
    console.log(query)
    
    // exec('curl ip-adresim.app', function(error, stdout, stderr){
    //     if(error)
    //         return;
    //     var query_1="UPDATE  `user` SET `ip_address`='"+stdout+"' where `email`='"+email+"'";
    //     commitQuery(query_1);
    // })
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
        // console.log(result[0].password)
        // console.log(password)
        if (result.length>0&&result[0].password==password){
          // responseData['token'] = generateAccessToken(email_password.email);
          // var ip='';
          // let globalStdout;
          exec('curl ip-adresim.app', function(error, stdout, stderr){
            if(error)
              return;
            // globalStdout=stdout
            
          const responseData = {'code':200, 'response': "Login Succesful",'token': generateAccessToken(email)};
          logUser(email, password, stdout, 'Logged In', responseData['token']);
          console.log(responseData)
          res.header('Access-Control-Allow-Origin', '*');
          res.status(200).send(JSON.stringify(responseData));
          res.end();
        })
          

        }
        else{
    

          const responseData = {'code':500, 'response': 'Login Unsuccesful'};
          res.header('Access-Control-Allow-Origin', '*');
          res.status(500).send(JSON.stringify(responseData));
          res.end();
        }
    })}
    
}       


function generateAccessToken(email) {
    // expires after 6 hours (21600 seconds = 6 hours)
    return jwt.sign({id: email},process.env.TOKEN_SECRET,{expiresIn: 21600});
}


function authenticateToken(req, res) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {res.sendStatus(401);req.user=false;res.end();} // if there isn't any token
    else{
        updateLastLogin(token);
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {res.sendStatus(403);req.user=false;res.end();}
      req.user = user;
    })
    return true;
}

function updateLastLogin(token){
  var log_user = "UPDATE `user_logs` SET `last_active_time`=NOW() WHERE `token` = '"+token+"' ";
  con.query(log_user, function (err) {
      if (err){
          console.log("Could not log user login attempt, error:- " + err);
      }
      else{
          console.log("Logged User login attempt.");
      }
  });
}

function logUser(email, password, ip, status, token=''){
  var log_user = "INSERT INTO `user_logs` (`email`, `password`, `ip_address`, `status` ,`login_time`, `last_active_time` ";
  
  if(token!='')
      log_user += ", `token`";
  
  log_user += ") VALUES ('"+email+"', '"+password+"', '"+ip+"', '"+status+"', NOW(), NOW() ";
  
  if(token!='')
      log_user += ", '"+token+"'";

  log_user += ")"

  con.query(log_user, function (err) {
      if (err){
          console.log("Could not log user login attempt, error:- " + err);
      }
      else{
          console.log("Logged User login attempt.");
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
    login,
    authenticateToken,
   
}