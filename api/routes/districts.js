const express 	= require("express");
const router 	= express.Router();

const DistrictController = require('../controllers/districts');

router.get('/get/list/:countryCode/:stateCode', DistrictController.getDistricts);


module.exports = router;