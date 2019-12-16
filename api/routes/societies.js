const express 	= require("express");
const router 	= express.Router();

const SocietiesController = require('../controllers/societies');

router.post('/post/', SocietiesController.insertsociety);

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName/:cityName/:areaName/:subareaName', SocietiesController.getsociety);

router.get('/get/getUnapprovedSociety/:countryCode/:stateCode/:districtName/:blockName/:cityName/:areaName/:subareaName', SocietiesController.getUnapprovedSociety);

router.patch('/patch/', SocietiesController.update_status);

router.patch('/patch/updateSociety', SocietiesController.updateSociety);

router.get('/get/searchresults/:searchText', SocietiesController.searchSocieties);


module.exports = router;