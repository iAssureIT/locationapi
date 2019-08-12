const express 	= require("express");
const router 	= express.Router();

const BlocksController = require('../controllers/blocks');

router.get('/get/list/:countryCode/:stateCode/:districtName', BlocksController.getBlocks);

router.get('/get/BlocksByState/:countryCode/:stateCode', BlocksController.getBlocksByState);

module.exports = router;  