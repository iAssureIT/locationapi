const express 	= require("express");
const router 	= express.Router();

const BlocksController = require('../controllers/blocks');

router.get('/get/list/:districtName/:stateCode/:countryCode', BlocksController.getBlocks);


module.exports = router;  