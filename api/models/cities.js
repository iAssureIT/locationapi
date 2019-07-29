const mongoose = require('mongoose');

const CitiesSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    stateName           : String,
    districtName        : String,
   	blockName			: String,
   	cityName			: String,
   	pinCode				: String
});

module.exports = mongoose.model('cities',CitiesSchema);

