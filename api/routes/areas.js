const express 	= require("express");
const router 	= express.Router();

const AreaController = require('../controllers/areas');

router.get('/get/list/:blockName/:districtName/:stateCode/:countryCode', AreaController.getAreas);



module.exports = router; 