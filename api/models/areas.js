const mongoose = require('mongoose');

const AreaSchema = mongoose.Schema({
	  _id			        : mongoose.Schema.Types.ObjectId, 
    countryCode     : String,
    stateName       : String,
    districtName    : String,
   	blockName		: String,
   	cityName		: String,
   	areaName		: String,
    pincode         : String
});

module.exports = mongoose.model('areas',AreaSchema);

