const mongoose = require('mongoose');

const BlockSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
    countryCode         : String,
    stateName           : String,
    stateCode			: String,
    districtName        : String,
   	blockName			: String  	
});
 
module.exports = mongoose.model('blocks',BlockSchema);

