const mongoose	= require("mongoose");
mongoose.Promise = global.Promise;
const async = require("async");
const States = require('../models/states');
const Districts = require('../models/districts');
const Blocks = require('../models/blocks');
const Cities = require('../models/cities');
const Pincodes = require('../models/pincodes');
const BadRecord = require('../models/badrecords');
const _          = require("underscore");
const parseSchema = require('mongodb-schema');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'locations';

exports.getAllStates = (req,res,next)=>{

    States.aggregate([
    { $lookup: 
           {
             from: 'countries',
             localField: 'countryID',
             foreignField: '_id',
             as: 'countryDetails'
           }
    },
      { "$unwind": "$countryDetails" },
      { "$addFields": { countryCode: '$countryDetails.countryCode', 
                        countryName: '$countryDetails.countryName' } },
      { "$match" : {"countryCode" :  { "$regex": req.params.countryCode, $options: "i" } } }  
    ]).sort({ "stateName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    var allData = data.map((x, i)=>{
                    return {
                        "_id"                 : x._id,
                        "countryCode"         : x.countryCode,
                        "countryName"         : x.countryName,
                        "stateCode"           : x.stateCode,
                        "stateName"           : camelCase(x.stateName)
                    }
                    })
                    res.status(200).json(allData);
                }else{
                    res.status(200).json({"message" : 'States not found for this '+ req.params.countryCode +' Country Code'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ 
                    error: err
                });
            });
}
var camelCase = (str)=>{
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}
exports.removeduplicates = (req,res,next)=>{
    var previousName;
    Cities.find({"stateID" : "5e0ecaa3e6ab1612ace9a9a0"})
                .exec()
                .then(data=>{
                    var allData = data.map((x, i)=>{
                        var name = x.cityName;
                        
                        if (name == previousName) {
                            //console.log(name);
                            
                            Cities.deleteOne({"stateID" : "5e0ecaa3e6ab1612ace9a9a0","cityName":name})
                            .exec()
                            .then(data1=>{
                                //console.log(data1);
                                return data1
                            })

                        }
                        previousName = name;
                    })
                     res.status(200).json(allData);
                })
};
exports.getSchema = (req,res,next)=>{

    MongoClient.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true }, function(err, client) {
      if (err) return console.error(err);

      const db = client.db(dbName);

      // here we are passing in a cursor as the first argument. You can
      // also pass in a stream or an array of documents directly.
      parseSchema(db.collection(req.params.collectionName).find(), function(err, schema) {
        if (err) return console.error(err);
        res.status(200).json(schema);
        client.close();
      });
    });
    
}


exports.bulkinsert = (req,res,next)=>{

    getData();
    var goodRecord = 0;
    var badRecord = 0;
    var DuplicateCount = 0;
    var invalidData = [];
    var invalidObjects = [];
    
    async function getData(){
        var invalidData = [];
        var invalidObjects = [];
        var finaldata = req.body.finaldata;
        //console.log('finaldata',finaldata)
        var excelData = req.body.excelData;
        var reqData = req.body.reqData;
        
        //1. find state 
        //2. find district
        //3. find block
        //4. find 
       for(k = 0 ; k < finaldata.length ; k++){

            if (finaldata[k].stateName != undefined ) {
                var insertStateObject = await insertState(finaldata[k], reqData)
                var stateID = insertStateObject._id;
                //console.log('k',k)

                if (finaldata[k].districtName && stateID) {
                    var insertDistrictObject = await insertDistrict(finaldata[k], stateID, reqData)
                    var districtID = insertDistrictObject._id;
                    
                    if (finaldata[k].blockName && districtID) {
                        var insertBlockObject = await insertBlock(finaldata[k], stateID, districtID, reqData)
                        var blockID = insertBlockObject._id;
                        
                        if (finaldata[k].villageName && blockID) {
                        var insertCityObject = await insertCity(finaldata[k], stateID, districtID, blockID, reqData)
                            if (insertCityObject.duplicate) {
                            if (excelData[k]) {
                                excelData[k].remark = "Dulicate record found";
                                invalidObjects.push(excelData[k]);
                                DuplicateCount++;
                            }
                           }else{
                            goodRecord++;
                           }
                        }
                    }
                }
            }
            
        }
        if (req.body.invalidData) {
            
            for(i = 0 ; i < req.body.invalidData.length ; i++){
                invalidObjects.push(req.body.invalidData[i])
            }
            //console.log('invalidObjects',invalidObjects); 
        }
        //console.log('invalidData',invalidData)
        invalidData.badRecords = invalidObjects
        invalidData.fileName = finaldata[0]['fileName'];
        invalidData.totalRecords = req.body.totalRecords;
        var insertBadDataObject = await insertBadData(invalidData); 
        if (goodRecord > 0 || DuplicateCount > 0) {
            //console.log('Process Completed',goodRecord);
            res.status(200).json({
                "completed": true
            });
        }else{
            res.status(200).json({
                "completed": false
            });
        }
        
    }
};

exports.areabulkinsert = (req,res,next)=>{

    getData();
    var goodRecord = 0;
    var badRecord = 0;
    var DuplicateCount = 0;
    var invalidData = [];
    var invalidObjects = [];
    
    async function getData(){
        var invalidData = [];
        var invalidObjects = [];
        var finaldata = req.body.finaldata;
        //console.log('finaldata',finaldata)
        var excelData = req.body.excelData;
        var reqData = req.body.reqData;
        
        //1. find state 
        //2. find district
        //3. find block
        //4. find 
       for(k = 0 ; k < finaldata.length ; k++){

            if (finaldata[k].stateName != undefined ) {
                var statePresent = await findState(finaldata[k].stateName);
                var stateID = statePresent._id;
                //console.log('k',k)

                if (finaldata[k].districtName && stateID) {
                    var districtPresent = await findDistrict(finaldata[k].districtName, stateID);
                     
                    var districtID = districtPresent._id;
                    
                    if (districtPresent._id) {
                        
                        var insertPincodeObject = await insertPincode(finaldata[k], stateID, districtPresent._id, reqData)
                            if (insertPincodeObject.duplicate) {
                            if (excelData[k]) {
                                excelData[k].remark = "Dulicate record found";
                                invalidObjects.push(excelData[k]);
                                DuplicateCount++;
                            }
                           }else{
                            goodRecord++;
                           }
                        
                    }else{
                        if (excelData[k]) {
                            excelData[k].remark = "District not found";
                            invalidObjects.push(excelData[k]);
                            DuplicateCount++;
                        }
                    }
                }
            }
            
        }
        if (req.body.invalidData) {
            
            for(i = 0 ; i < req.body.invalidData.length ; i++){
                invalidObjects.push(req.body.invalidData[i])
            }
            //console.log('invalidObjects',invalidObjects); 
        }
        //console.log('invalidData',invalidData)
        invalidData.badRecords = invalidObjects
        invalidData.fileName = finaldata[0]['fileName'];
        invalidData.totalRecords = req.body.totalRecords;
        var insertBadDataObject = await insertBadData(invalidData); 
        if (goodRecord > 0 || DuplicateCount > 0) {
            //console.log('Process Completed',goodRecord);
            res.status(200).json({
                "completed": true
            });
        }else{
            res.status(200).json({
                "completed": false
            });
        }
        
    }
};

var insertState = async (data,reqData) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        stateDuplicateControl();
        async function stateDuplicateControl(){
            var statePresent = await findState(data.stateName);
            //console.log('statePresent',statePresent)    
            if (statePresent==0) {
            const state = new States({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqData.countryID,
                    stateName               : data.stateName,
                    stateCode               : data.stateCode,
                    fileName                : data.fileName,
                    createdAt               : new Date()
                    });
                    
                    state
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var statePresent = await findState(data.stateName);
                resolve(statePresent);
            }
        }
    })
}
var insertDistrict = async (data, stateID, reqData) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        districtDuplicateControl();
        async function districtDuplicateControl(){
            var districtPresent = await findDistrict(data.districtName, stateID);
            //console.log('districtPresent',districtPresent)    
            if (districtPresent==0) {
            const district = new Districts({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqData.countryID,
                    stateID                 : stateID,
                    districtName            : data.districtName,
                    fileName                : data.fileName,
                    createdAt               : new Date()
                    });
                    
                    district
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var districtPresent = await findDistrict(data.districtName, stateID);
                resolve(districtPresent);
            }
        }
    })
}

exports.addState = (req,res,next)=>{
    // This API is used for Adding/inserting State from UI side
     States.findOne({ "stateName": {'$regex' : req.body.stateName , $options: "i"} })
    .exec()
    .then(state=>{
        if(!state){
            const state = new States({
                _id                     : new mongoose.Types.ObjectId(),                    
                countryCode             : req.body.countryCode,
                countryName             : req.body.countryName,
                stateName               : req.body.stateName,
                stateCode               : req.body.stateCode,
                createdAt               : new Date()
            });

                    
            state.save()
                .then(data=>{
                    res.status(200).json({
                        message: "State inserted successfully",
                    })
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
        }else{
             res.status(200).json({
                message: "State already exist",
            })
         }
    });
}    
var insertBlock = async (data, stateID, districtID, reqData) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        blockDuplicateControl();
        async function blockDuplicateControl(){
            var blockPresent = await findBlock(data.blockName, stateID, districtID);
            //console.log('statePresent',statePresent)    
            if (blockPresent==0) {
            const block = new Blocks({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqData.countryID,
                    stateID                 : stateID,
                    districtID              : districtID,
                    blockName               : data.blockName,
                    fileName                : data.fileName,
                    createdAt               : new Date()
                    });
                    
                    block
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var blockPresent = await findBlock(data.blockName, stateID, districtID);
                resolve(blockPresent);
            }
        }
    })
}

var insertCity = async (data, stateID, districtID, blockID, reqData) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        cityDuplicateControl();
        async function cityDuplicateControl(){
            var cityPresent = await findCity(data.villageName, stateID, districtID, blockID);
            //console.log('cityPresent',cityPresent)    
            if (cityPresent==0) {
            const city = new Cities({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqData.countryID,
                    stateID                 : stateID,
                    districtID              : districtID,
                    blockID                 : blockID,
                    cityName                : data.villageName,
                    fileName                : data.fileName,
                    createdAt               : new Date()
                    });
                    
                    city
                    .save()
                    .then(data=>{

                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var cityPresent = await findCity(data.villageName, stateID, districtID, blockID);
                resolve({cityPresent:cityPresent, duplicate: true});
            }
        }
    })
}
var insertPincode = async (data, stateID, districtID, reqData) => {
    //console.log('pincode', typeof data.pincode)
    return new Promise(function(resolve,reject){ 
        pincodeDuplicateControl();
        async function pincodeDuplicateControl(){
            var pincodePresent = await findPincode(data.pincode.toString().trim(), stateID, districtID);
            console.log('pincodePresent',pincodePresent)    
            //console.log('pincodePresent',pincodePresent)   
            if (pincodePresent==0) {
            const pincode = new Pincodes({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqData.countryID,
                    stateID                 : stateID,
                    districtID              : districtID,
                    areaName                : data.areaName,
                    pincode                 : data.pincode.toString().trim(),
                    fileName                : data.fileName,
                    createdAt               : new Date()
                    });
                    
                    pincode
                    .save()
                    .then(data=>{

                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var pincodePresent = await findPincode(data.pincode, stateID, districtID);
                resolve({pincodePresent:pincodePresent, duplicate: true});
            }
        }
    })
}
function findState(stateName) {
    return new Promise(function(resolve,reject){  
    States.findOne({ "stateName": {'$regex' : "^"+stateName+"$" , $options: "i"} })
                .exec()
                .then(stateObject=>{
                    if(stateObject){
                        resolve(stateObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}

function findDistrict(districtName, stateID) {
    return new Promise(function(resolve,reject){  
    Districts.findOne({ //"districtName":districtName,
        "districtName": {'$regex' : districtName , $options: "i"}, 
        "stateID": stateID })
                .exec()
                .then(districtObject=>{
                    if(districtObject){
                        resolve(districtObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findBlock(blockName, stateID, districtID) {
    return new Promise(function(resolve,reject){  
    Blocks.findOne({   
        "blockName":blockName,
        //"blockName": {'$regex' : "^"+blockName+"$" , $options: "i"}, 
                    "stateID": stateID,  "districtID":districtID})
                .exec()
                .then(blockObject=>{
                    if(blockObject){
                        resolve(blockObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findCity(cityName, stateID, districtID, blockID) {
    return new Promise(function(resolve,reject){  
    
    Cities.findOne({   "cityName": cityName, 
                    "stateID": stateID,  "districtID":districtID,
                    "blockID":blockID})
                .exec()
                .then(cityObject=>{
                    //console.log('cityName',cityName)
                    //console.log('cityObject',cityObject)
                    if(cityObject){
                        resolve(cityObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findPincode(pincode, stateID, districtID) {
    return new Promise(function(resolve,reject){  
    
    Pincodes.findOne({   "pincode": pincode, 
                    "stateID": stateID,  "districtID":districtID })
                .exec()
                .then(pincodeObject=>{
                    //console.log('cityName',cityName)
                    //console.log('cityObject',cityObject)
                    if(pincodeObject){
                        resolve(pincodeObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
var insertBadData = async (invalidData) => {
     //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    BadRecord.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
                if(data.length>0){
                    if (data[0].badRecords.length>0) {
                        BadRecord.updateOne({ fileName:invalidData.fileName},  
                             {   $set:   { 'badRecords': [] } })
                            .then(data=>{
                            if(data.nModified == 1){
                               BadRecord.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'badRecords' : invalidData.badRecords } 
                                })
                                .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{
                                reject(err);
                            });
                            }else{
                                resolve(0);
                            }
                        })
                        .catch(err =>{
                            reject(err);
                        });
                    } 
                    else{
                        //console.log('data',data)   
                        BadRecord.updateOne({ fileName:invalidData.fileName},  
                            {   $set:   {'totalRecords': invalidData.totalRecords},
                                $push:  { 'badRecords' : invalidData.badRecords } 
                            })
                            .then(data=>{
                            if(data.nModified == 1){
                                resolve(data);
                            }else{
                                resolve(data);
                            }
                        })
                        .catch(err =>{
                            reject(err);
                        });
                    } 
                }else{
                    const badRecord = new BadRecord({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    badRecords              : invalidData.badRecords,
                    fileName                : invalidData.fileName,
                    totalRecords            : invalidData.totalRecords,
                    createdAt               : new Date()
                    });
                    
                    badRecord
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
                }
            })  
    
    })            
}


exports.fetch_file = (req,res,next)=>{
    Cities.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'count': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    console.log(req.params.fileName)
    States.find({fileName:req.params.fileName})
    .exec()
    .then(data=>{
        //finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        BadRecord.find({fileName:req.params.fileName})  
            .exec()
            .then(badData=>{
                finaldata.badrecords = badData[0].badRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.pincodefiledetails = (req,res,next)=>{
    var finaldata = {};
    //console.log(req.params.fileName)
    Pincodes.find({fileName:req.params.fileName})
    .exec()
    .then(data=>{
        //finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        BadRecord.find({fileName:req.params.fileName})  
            .exec()
            .then(badData=>{
                finaldata.badrecords = badData[0].badRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_file_count = (req,res,next)=>{
    States.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'count': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_file = (req,res,next)=>{
    States.deleteMany({"fileName":req.params.fileName})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Records of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};