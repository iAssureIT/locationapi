const express 	= require("express");
const router 	= express.Router();

const StatesController = require('../controllers/states');

router.get('/get/list/:countryCode', StatesController.getAllStates);


module.exports = router;