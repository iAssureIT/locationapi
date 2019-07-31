const express 	= require("express");
const router 	= express.Router();

const CitiesController = require('../controllers/cities');

router.get('/get/list/:blockName/:districtName/:stateCode/:countryCode', CitiesController.getCities);

module.exports = router;  