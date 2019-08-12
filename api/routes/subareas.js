const express 	= require("express");
const router 	= express.Router();

const SubAreaController = require('../controllers/subareas');

router.post('/post/', SubAreaController.insertSubarea);

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName/:cityName/:areaName', SubAreaController.getSubAreas);

router.patch('/patch/', SubAreaController.update_status);

module.exports = router;