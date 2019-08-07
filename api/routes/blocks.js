const express 	= require("express");
const router 	= express.Router();

const BlocksController = require('../controllers/blocks');

router.get('/get/list/:districtName/:stateCode/:countryCode', BlocksController.getBlocks);

router.get('/get/BlocksByState/:stateCode/:countryCode', BlocksController.getBlocksByState);

module.exports = router;  