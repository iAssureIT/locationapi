const express 	= require("express");
const router 	= express.Router();

const CountriesController = require('../controllers/countries');

router.get('/get/', LocationController.getAllStates);


module.exports = router;