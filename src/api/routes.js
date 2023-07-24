/* eslint-env node */
/**
 * Summary: Initialize routes for API application
 */
const CONTROLLERS = require("./controllers");

const BASE_URL = "/api/v1";

module.exports = function routes(router) {
  router.get(`${BASE_URL}/getstaticdata`, CONTROLLERS.getstaticdata);
  router.post(`${BASE_URL}/signin`, CONTROLLERS.login);
  router.post(`${BASE_URL}/signup`,CONTROLLERS.register);
  router.get(`${BASE_URL}/profile`,CONTROLLERS.profile);
  router.post(`${BASE_URL}/setting`,CONTROLLERS.settings);


  router.get(`${BASE_URL}/all_offers`,CONTROLLERS.all_offers);
  router.post(`${BASE_URL}/all_offers`,CONTROLLERS.all_offers);

  router.get(`${BASE_URL}/all_offers_1`,CONTROLLERS.all_offers_1);
  router.post(`${BASE_URL}/all_offers_1`,CONTROLLERS.all_offers_1);


  router.get(`${BASE_URL}/report`,CONTROLLERS.report);
  router.get(`${BASE_URL}/tracking`,CONTROLLERS.tracking);
  router.get(`${BASE_URL}/postback`,CONTROLLERS.postback);
  router.post(`${BASE_URL}/request`,CONTROLLERS.request);
  router.post(`${BASE_URL}/update_post`,CONTROLLERS.update_post);
  router.get(`${BASE_URL}/invoice`,CONTROLLERS.invoice);




  
};