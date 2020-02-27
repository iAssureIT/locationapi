const mongoose	= require("mongoose");
const async = require("async");
const BadRecord = require('../models/badrecords');
const _         = require("underscore");
const Districts = require('../models/districts');

exports.getDistricts = (req,res,next)=>{
    Districts.aggregate([
    { $lookup:
           {
             from: 'countries',
             localField: 'countryID',
             foreignField: '_id',
             as: 'countryDetails'
           }
    },
    { $lookup: 
           {
             from: 'states',
             localField: 'stateID',
             foreignField: '_id',
             as: 'stateDetails'
           }
     },
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } } }                 
    ]).sort({ "districtName": 1 })
                .exec()
                .then(data=>{
                    if(data.length>0){
                        var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName,  
                            "stateCode"           : x.stateCode,
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                        }
                        })
                        res.status(200).json(allData);
                        //res.status(200).json(data);
                    }else{
                        res.status(200).json({"message" : 'District not found for this '+ req.params.stateCode +' State Code and '+req.params.countryCode+' Country Code'});
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.getDistrictsFromMultipleStates = (req,res,next)=>{
    Districts.aggregate([
    { $lookup:
           {
             from: 'countries',
             localField: 'countryID',
             foreignField: '_id',
             as: 'countryDetails'
           }
    },
    { $lookup: 
           {
             from: 'states',
             localField: 'stateID',
             foreignField: '_id',
             as: 'stateDetails'
           }
     },
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.body.countryCode, $options: "i" },
                     "stateCode"   :  { $in :   req.body.stateCodes  }  } }                 
    ]).sort({ "districtName": 1 })
    
                .exec()
                .then(data=>{
                    if(data.length>0){
                        var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName,  
                            "stateCode"           : x.stateCode,
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                        }
                        })
                        res.status(200).json(allData);
                        //res.status(200).json(data);
                    }else{
                        res.status(200).json({"message" : 'District not found for this '+ req.params.stateCode +' State Code and '+req.params.countryCode+' Country Code'});
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
exports.bulkinsert = (req,res,next)=>{

    getData();
    var goodRecord = 0;
    var badRecord = 0;
    var DuplicateCount = 0;
    var invalidData = [];
    var invalidObjects = [];
    
    async function getData(){
        var districtsData = req.body.finaldata;
        var excelData = req.body.excelData;
        var reqData = req.body.reqData;
        //console.log('districtsData',districtsData)
        for(k = 0 ; k < districtsData.length ; k++){
            var insertDistrictObject = await insertDistrict(districtsData[k],reqData);
            //console.log('insertDistrictObject',insertDistrictObject)
            if (insertDistrictObject != 0) {
                goodRecord++;
            }else{
                //console.log('duplicates',excelData[k]);
                excelData[k].remark = "Dulicate record found";
                invalidObjects.push(excelData[k]);
                DuplicateCount++;
            }  
        }
        
        if (req.body.invalidData) {
            
            for(i = 0 ; i < req.body.invalidData.length ; i++){
                invalidObjects.push(req.body.invalidData[i])
            }
            invalidData.badRecords = invalidObjects
            invalidData.fileName = districtsData[0]['fileName'];
            invalidData.totalRecords = req.body.totalRecords;
            var insertBadDataObject = await insertBadData(invalidData); 
            //console.log(insertBadDataObject);    
        }
        if (goodRecord > 0 || DuplicateCount > 0) {
            res.status(200).json({
                "message": "Process Completed"
            });
        }else{
            res.status(200).json({
                "message": "Process Failed"
            });
        }
        
    }
};

var insertDistrict = async (data,reqData) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        districtDuplicateControl();
        async function districtDuplicateControl(){
            var districtPresent = await findDistrict(data.districtName,reqData.stateID);
            // console.log('districtPresent',districtPresent)    
            if (districtPresent==0) {
                const district = new Districts({
                _id                     : new mongoose.Types.ObjectId(),                    
                countryID               : reqData.countryID,
                stateID                 : reqData.stateID,
                districtName            : data.districtName,
                fileName                : data.fileName,
                createdAt               : new Date()
                });
                
                district
                .save({checkKeys: false})
                .then(data=>{
                    resolve(data._id);
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
            }else{
                resolve(0);
            }
        }
    })
}

function findDistrict(districtName, stateID) {
    return new Promise(function(resolve,reject){  
    Districts.findOne({ "districtName": {'$regex' : districtName , $options: "i"}, "stateID": stateID })
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
                    .save({checkKeys: false})
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
exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    
    Districts.find({fileName:req.params.fileName})
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