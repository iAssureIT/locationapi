const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryID  	        : { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    stateName           : String,
    type                : String,
   	stateCode			: String,
   	fileName			: String,
   	createdAt 			: Date
});

module.exports = mongoose.model('states',StateSchema);

