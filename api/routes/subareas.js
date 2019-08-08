const express 	= require("express");
const router 	= express.Router();

const SubAreaController = require('../controllers/subareas');

router.post('/post/', SubAreaController.insertSubarea);

module.exports = router; 