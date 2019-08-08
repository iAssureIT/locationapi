const mongoose = require('mongoose');

const SubAreaSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId, 
    countryCode     : String,
    stateName       : String,
    districtName    : String,
   	blockName		: String,
   	cityName		: String,
   	areaName		: String,
   	subareaName		: String,
    pincode         : String
});

module.exports = mongoose.model('subareas',SubAreaSchema);

