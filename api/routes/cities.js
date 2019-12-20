const express 	= require("express");
const router 	= express.Router();

const CitiesController = require('../controllers/cities');

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName', CitiesController.getCities);

router.get('/get/citiesByState/:countryCode/:stateCode', CitiesController.getCitiesByState);

router.post('/post/addCity',CitiesController.addCity);

module.exports = router;  