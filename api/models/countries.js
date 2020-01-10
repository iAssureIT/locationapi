const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    countryName       	: String,
   	fileName			: String,
   	createdAt 			: Date
});

module.exports = mongoose.model('countries',CountrySchema);

