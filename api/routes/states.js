const express 	= require("express");
const router 	= express.Router();

const StatesController = require('../controllers/states');

router.get('/get/schema/:collectionName', StatesController.getSchema);

router.get('/get/list/:countryCode', StatesController.getAllStates);

router.post('/post/bulkinsert', StatesController.bulkinsert);

router.get('/get/files',StatesController.fetch_file);

router.get('/get/files/count',StatesController.fetch_file_count);

router.get('/get/filedetails/:fileName',StatesController.filedetails);

router.delete('/file/delete/:fileName',StatesController.delete_file);

router.post('/post/addState',StatesController.addState);

module.exports = router;