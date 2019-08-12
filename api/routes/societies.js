const express 	= require("express");
const router 	= express.Router();

const SocietiesController = require('../controllers/societies');

router.post('/post/', SocietiesController.insertsociety);

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName/:cityName/:areaName/:subareaName', SocietiesController.getsociety);

router.patch('/patch/', SocietiesController.update_status);

module.exports = router;