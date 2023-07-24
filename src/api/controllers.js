/* eslint-env node */
/**
 * Summary: Contains controller code for the APIs
 */

const DEBUG = require("../lib/debugger")("api-controllers");
const moment = require('moment');
const { con } = require("../connection");

// $$$$$$$$$$%%%%%%%%%%################ APPLICATION LEVEL APIs ####################%%%%%%%%$$$$$$$ //
// [/login] BASIC AUTH FUNCTIONS IN APPLICATION, INCLUDES(JWT)

function login(req, res) {
  var email = "";
  var password = "";
  if (req.body.email)
    email = req.body.email;
  if (req.body.password) {
    password = req.body.password;
  }

  console.log(email)
  if (req.method == 'POST') {
    const helper = require("./helper/authValidation");
    helper.login(res, email, password)
  }
}

function getstaticdata(req, res) {
  if (req.method == 'GET') {
    const helper = require("./helper/dashboard");

    var start_date="";
    var end_date="";
    if (req.query.start_date && req.query.end_date){
      start_date=req.query.start_date
      end_date= req.query.end_date
    }
    var required = "";
    if (req.query.required)
      required = req.query.required;

    console.log(required)
    helper.GetHomepageReports(res, required,start_date,end_date)


  }
}

function register(req, res) {

  if (req.method == 'POST') {
    const helper = require("./helper/register");

    var username = req.body.username;
    var email = req.body.email;
    var company_name = req.body.company_name;
    var password = req.body.password;
    var website = req.body.website;
    var country = req.body.country;
    var address = req.body.address;
    var phone = req.body.phone;
    var skype_link = req.body.skype_link;

    helper.register(res, username, email, company_name, password, website, country, address, phone, skype_link)
  }
}

function all_offers(req, res) {
  if (req.method == 'GET') {
      const helper = require("./helper/all_offers");
      var username = req.query.username;
      var condition = '';
      if (req.query.offer_name != '' && req.query.offer_name != undefined)
        condition += " AND `offer_name`='" + req.query.offer_name + "' ";
      if (req.query.offer_id != '' && req.query.offer_id != undefined)
        condition += " AND `offer_id`='" + req.query.offer_id + "' ";
      if (req.query.country != '' && req.query.country != undefined)
        condition += " AND `country`='" + req.query.country + "' ";
      if (req.query.model != '' && req.query.model != undefined)
        condition += " AND `model`='" + req.query.model + "' ";
      if (req.query.platform != '' && req.query.platform != undefined)
        condition += " AND `platform`='" + req.query.platform + "' ";
      if (req.query.approved != '' && req.query.approved != undefined)
        condition += " AND concat(',', approved_pubs, ',') LIKE '" +"%,"+ req.query.approved +",%"+ "' ";
     
        if(req.query.start_date!=''&&req.query.start_date!=undefined)
        condition +=" AND  `createdAt`>='"+req.query.start_date+" 00:00:00' ";
     if(req.query.end_date!=''&&req.query.end_date!=undefined)
        condition +=" AND `createdAt`<'"+req.query.end_date+" 23:59:59' ";
      helper.all_offersReport(res, username, condition);
    
  }

}
function all_offers_1(req, res) {
  if (req.method == 'GET') {
      const helper = require("./helper/all_offers");
      var username = req.query.username;
      var condition = '';
      if (req.query.offer_name != '' && req.query.offer_name != undefined)
        condition += " AND `offer_name`='" + req.query.offer_name + "' ";
      if (req.query.offer_id != '' && req.query.offer_id != undefined)
        condition += " AND `offer_id`='" + req.query.offer_id + "' ";
      if (req.query.country != '' && req.query.country != undefined)
        condition += " AND `country`='" + req.query.country + "' ";
      if (req.query.model != '' && req.query.model != undefined)
        condition += " AND `model`='" + req.query.model + "' ";
      if (req.query.platform != '' && req.query.platform != undefined)
        condition += " AND `platform`='" + req.query.platform + "' ";
      if (req.query.approved != '' && req.query.approved != undefined)
        condition += " AND concat(',', approved_pubs, ',') NOT LIKE '" +"%,"+ req.query.approved +",%"+ "' ";
      
      if(req.query.start_date!=''&&req.query.start_date!=undefined)
        condition +=" AND  `createdAt`>='"+req.query.start_date+" 00:00:00' ";
     if(req.query.end_date!=''&&req.query.end_date!=undefined)
        condition +=" AND `createdAt`<'"+req.query.end_date+" 23:59:59' ";
      helper.all_offersReport(res, username, condition);
    
  }

}

function report(req, res) {

  if (req.method == 'GET') {
    const helper = require("./helper/report");
    var start_date="";
    var end_date="";
    if (req.body.start_date && req.body.end_date){
      start_date=req.body.start_date
      end_date= req.body.end_date
    }
    var filters=req.body;
    console.log(filters)
    
    helper.report(res, req.body.groupBy,start_date,end_date,filters)


  }
}

function tracking(req, res) {

  if (req.method == 'GET') {
    const helper = require("./helper/all_offers");
    var offer_id="";
    if (req.query.offer_id){
      offer_id=req.query.offer_id
    }
    
    console.log(offer_id)
    // console.log(company)
    
    helper.tracking(res,offer_id)


  }
}
function postback(req, res) {

  if (req.method == 'GET') {
    const helper = require("./helper/report");
    var publisher_name="";
   console.log("hello"+publisher_name)
    if (req.query.publisher_name){
      publisher_name=req.query.publisher_name
    }
    
    
    helper.postback(res,publisher_name)


  }
}

function request(req,res){
  if (req.method == 'POST') {
    const helper = require("./helper/report");
    var offer_id="";
    var publisher_name="";
    if (req.body.offer_id){
      offer_id=req.body.offer_id
    }
    if (req.body.publisher_name){
      publisher_name=req.body.publisher_name
    }
    console.log(offer_id)
    
    helper.request(res,offer_id,publisher_name)


  }
}

function update_post(req,res){
  if (req.method == 'POST') {
    const helper = require("./helper/report");
    var name="";
    var type="";
    var postback="";
    var parameters="";
    var exist_name="";


    if (req.body.name){
      name=req.body.name
    }
    if (req.body.type){
      type=req.body.type
    }
    if (req.body.postback){
      postback=req.body.postback
    }
    if (req.body.parameters){
      parameters=req.body.parameters
    }
    if (req.body.exist_name){
      exist_name=req.body.exist_name
    }
    
    
    helper.update_post(res,name,exist_name,type,postback,parameters)


  }
}


function invoice(req,res){
  if (req.method == 'GET') {
    const helper = require("./helper/report");
    var publisher_name="";
    if (req.query.publisher_name){
      publisher_name=req.query.publisher_name
    }
    console.log(publisher_name)
    var start_date="";
    // var end_date="";
    if (req.query.start_date ){
      start_date=req.query.start_date
    }
    
    
    helper.invoice(res,publisher_name,start_date)


  }
}
function profile(req,res){
  if (req.method == 'GET') {
    const helper = require("./helper/dashboard");
    var username="";
    if (req.query.username){
      username=req.query.username
    }
    // console.log(publisher_name)
    // var start_date="";
    // var end_date="";
    // if (req.query.start_date ){
    //   start_date=req.query.start_date
    // }
    
    
    helper.profile(res,username)
  }

}

function settings(req, res) {
  if (req.method == 'POST') {
    const helper = require("./helper/dashboard");
    
    
      var username = "";
      var company = "";
      var job = "";
      var country = "";
      var address = "";
      var phone = "";
      var email = "";
      var skype_link = "";
      var thumbnail = "";
      var exist_name="";

    // console.log(exist_name)
      if (req.body.exist_name) {
        exist_name = req.body.exist_name;
      }

      if (req.body.company) {
        company = req.body.company;
      }
      if (req.body.username) {
        username = req.body.username;
      }
      if (req.body.job) {
        job = req.body.job;
      }
      if (req.body.email) {
        email = req.body.email;
      }
      if (req.body.country) {
        country = req.body.country;
      }
      if (req.body.address) {
        address = req.body.address;
      } 
      if (req.body.phone) {
        phone = req.body.phone;
      } 
      if (req.body.skype_link) {
        skype_link = req.body.skype_link;
      } 
      if (req.body.thumbnail) {
        thumbnail = req.body.thumbnail;
      }
      console.log(password)
      // console.log(con_pass)
      helper.settings(res, username, company, job, country, address,phone,email,skype_link,thumbnail,exist_name)
    

  }



}
module.exports = {
  login,
  getstaticdata,
  register,
  all_offers,
  all_offers_1,
  report,
  tracking,
  postback,
  request,
  update_post,
  invoice,
  profile,
  settings
}