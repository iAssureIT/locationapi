const express 	= require("express");
const router 	= express.Router();

const CountriesController = require('../controllers/countries');

router.post('/post', CountriesController.insertCountry);

router.get('/get/list', CountriesController.getAllCountries);

module.exports = router;