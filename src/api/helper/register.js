/* eslint-env node */
const moment = require('moment');
const con = require("../../connection/index").con;
var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=e;d.setDate(d.getDate()+1)){ a.push(moment(new Date(d)).format('YYYY-MM-DD').toString());}return a;};


function register(res,username,email,company_name,password,website,country,address,phone,skype_link)   {
  var select = "SELECT email FROM user_profile WHERE email = '"+email+"'";
  con.query(select, function (err, result) {
    console.log(result)
    console.log(email)
    if (result.length > 0){
      return res.send({"message":"Duplicate Entry"})
    }
    else{
      var query = "INSERT INTO `user_profile` (username,email, company, password, website,country,address,phone,skype_link) VALUES ('"+username+"','"+email+"','"+company_name+"','"+password+"','"+website+"','"+country+"','"+address+"','"+phone+"','"+skype_link+"')";
      commitQuery(query);
      responseData = {'code':200, 'response': 'User Registered!!'};
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(JSON.stringify(responseData));
      res.end();
    }
  })
}



// UTILITY FUNCTIONS

function commitQuery(query){
  if (!con){ 
    console.log("Could not connect to database!");
  }
  else{
    console.log(query);
    con.query(query, function (err, result) {
      if (err){
        console.log(err);
      }
      else{
        console.log("Query Success!");
      }
    });
  }
}

module.exports = {
  register
}