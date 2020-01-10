const mongoose = require('mongoose');

const CitiesSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    stateID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'states' },   
   	districtID  	    : { type: mongoose.Schema.Types.ObjectId, ref: 'districts' },   
   	blockID  	    	: { type: mongoose.Schema.Types.ObjectId, ref: 'blocks' },   
   	cityName			: String, 
   	fileName			: String,	
   	createdAt 			: Date,
});

module.exports = mongoose.model('cities',CitiesSchema);

