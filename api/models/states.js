const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    countryName       	: String,
    stateName           : String,
    type                : String,
   	stateCode			: String,
   	fileName			: String,
   	createdAt 			: Date
});

module.exports = mongoose.model('states',StateSchema);

