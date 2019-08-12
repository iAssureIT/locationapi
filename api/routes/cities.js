const express 	= require("express");
const router 	= express.Router();

const CitiesController = require('../controllers/cities');

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName', CitiesController.getCities);

module.exports = router;  