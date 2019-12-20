const mongoose	= require("mongoose");
const async = require("async");
const States = require('../models/states');
const BadRecord = require('../models/badrecords');
const _          = require("underscore");
const parseSchema = require('mongodb-schema');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'locations';

exports.getAllStates = (req,res,next)=>{

    States  .find(
            {"countryCode":   { "$regex": req.params.countryCode, $options: "i"}}
            ).sort({ "stateName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
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

exports.getSchema = (req,res,next)=>{

    MongoClient.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true }, function(err, client) {
      if (err) return console.error(err);

      const db = client.db(dbName);

      // here we are passing in a cursor as the first argument. You can
      // also pass in a stream or an array of documents directly.
      parseSchema(db.collection(req.params.collectionName).find(), function(err, schema) {
        if (err) return console.error(err);

        //console.log(JSON.stringify(schema, null, 2));

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
        var statesData = req.body.finaldata;
        var excelData = req.body.excelData;
        //console.log('excelData',excelData)
        for(k = 0 ; k < statesData.length ; k++){
            var insertStateObject = await insertState(statesData[k]);
            console.log('insertStateObject',insertStateObject)
            if (insertStateObject != 0) {
                goodRecord++;
            }else{
                console.log('duplicates',excelData[k]);
                excelData[k].remark = "Dulicate record found";
                invalidObjects.push(excelData[k]);
                DuplicateCount++;
            }  
        }
        
        if (req.body.invalidData) {
            
            for(i = 0 ; i < req.body.invalidData.length ; i++){
                invalidObjects.push(req.body.invalidData[i])
            }
            console.log('invalidObjects',invalidObjects);
            invalidData.badRecords = invalidObjects
            invalidData.fileName = statesData[0]['fileName'];
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


var insertState = async (data) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        stateDuplicateControl();
        async function stateDuplicateControl(){
            var statePresent = await findState(data.stateName);
            //console.log('statePresent',statePresent)    
            if (statePresent==0) {
                const state = new States({
                _id                     : new mongoose.Types.ObjectId(),                    
                countryCode             : data.countryCode,
                countryName             : data.countryName,
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
                resolve(0);
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
    })
}


function findState(stateName) {
    return new Promise(function(resolve,reject){  
    States.findOne({ "stateName": {'$regex' : stateName , $options: "i"} })
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

var insertBadData = async (invalidData) => {
     //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    BadRecord.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
                if(data.length>0){
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