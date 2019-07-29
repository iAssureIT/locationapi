const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    stateName           : String,
    type                : String,
   	stateCode			: String
});

module.exports = mongoose.model('states',StateSchema);

