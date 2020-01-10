const mongoose = require('mongoose');

const DistrictSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    stateID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'states' },   
   	districtName		: String,
   	fileName			: String,
   	createdAt 			: Date
});

module.exports = mongoose.model('districts',DistrictSchema);

