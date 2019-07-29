const mongoose = require('mongoose');

const DistrictSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    stateName           : String,
    stateCode           : String,
   	districtName		: String,
});

module.exports = mongoose.model('districts',DistrictSchema);

