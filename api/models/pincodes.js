const mongoose = require('mongoose');

const PincodeSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    stateID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'states' },   
   	districtID  	    : { type: mongoose.Schema.Types.ObjectId, ref: 'districts' },   
   	areaName			: String, 
   	pincode				: String,
   	fileName			: String,	
   	createdAt 			: Date
});
 
module.exports = mongoose.model('pincodes',PincodeSchema);

