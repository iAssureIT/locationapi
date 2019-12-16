const mongoose = require('mongoose');

const SocietiesSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId, 
    countryCode     : String,
    stateCode       : String,
    districtName    : String,
   	blockName		    : String,
   	cityName		    : String,
   	areaName		    : String,
   	subareaName		  : String,
   	societyName 	  : String,
    status          : String
});

module.exports = mongoose.model('societies',SocietiesSchema);

