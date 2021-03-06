const express 	= require("express");
const router 	= express.Router();

const AreaController = require('../controllers/areas');

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName/:cityName', AreaController.getAreas);

router.get('/get/list/:pincode', AreaController.getAreaByPincode);

router.get('/get/list/searchByAreaBlock/:string', AreaController.searchByAreaBlockDistrictString);

router.get('/get/areaDetails/:area', AreaController.areaDetails);



module.exports = router; 