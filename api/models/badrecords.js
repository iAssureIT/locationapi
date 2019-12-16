const mongoose = require('mongoose');

const BadRecordSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId, 
	totalRecords 		: Number,
    badRecords         	: Array,
    fileName       		: String,
   	createdAt 			: Date
});

module.exports = mongoose.model('badrecords',BadRecordSchema);

