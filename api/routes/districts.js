const express 	= require("express");
const router 	= express.Router();

const DistrictController = require('../controllers/districts');

router.get('/get/list/:countryCode/:stateCode', DistrictController.getDistricts);

router.post('/post/bulkinsert', DistrictController.bulkinsert);
 
router.get('/get/filedetails/:fileName',DistrictController.filedetails);


module.exports = router;