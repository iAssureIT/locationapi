const mongoose = require('mongoose');

const SubAreaSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId, 
    countryCode     : String,
    stateCode       : String,
    districtName    : String,
   	blockName				: String,
   	cityName				: String,
   	areaName				: String,
   	subareaName			: String,
    pincode         : String,   	
    status          : String
});

module.exports = mongoose.model('subareas',SubAreaSchema);

