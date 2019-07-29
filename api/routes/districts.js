const express 	= require("express");
const router 	= express.Router();

const DistrictController = require('../controllers/districts');

router.get('/get/list/:stateCode/:countryCode', DistrictController.getDistricts);


module.exports = router;