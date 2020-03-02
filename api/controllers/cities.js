const mongoose	= require("mongoose");
const async = require("async");
var   ObjectID          = require('mongodb').ObjectID;
const Cities = require('../models/cities');

exports.getCities = (req,res,next)=>{
    Cities.aggregate([
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
     { $lookup:
           {
             from: 'districts',
             localField: 'districtID',
             foreignField: '_id',
             as: 'districtDetails'
           }
     },
     { $lookup:
           {
             from: 'blocks',
             localField: 'blockID',
             foreignField: '_id',
             as: 'blockDetails'
           }
     },
    
    { "$match" : {  "countryDetails.countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                    "stateDetails.stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } ,
                    //"districtDetails.districtName":  { "$regex": req.params.districtName, $options: "i" },
                    //"blockName"   :  { "$regex": req.params.blockName, $options: "i" }
                    } 
        }     
    ])
   
            .exec()
            .then(data=>{   
                  
                if(data.length>0){   
                    var allData = data.map((x, i)=>{
                        //console.log(x);   
                        if (x.districtDetails[0].districtName.toLowerCase() == req.params.districtName
                            && x.blockDetails[0].blockName.toLowerCase()== req.params.blockName) {}
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryDetails[0].countryCode,
                            "countryName"         : x.countryDetails[0].countryName, 
                            "stateCode"           : x.stateDetails[0].stateCode, 
                            "stateName"           : camelCase(x.stateDetails[0].stateName),
                            "districtName"        : camelCase(x.districtDetails[0].districtName),
                            "blockName"           : camelCase(x.blockDetails[0].blockName),
                            "cityName"            : camelCase(x.cityName)  
                        }
                        })
                        res.status(200).json(allData); 
                }else{
                    res.status(200).json({"message" : 'City not found for this '+ req.params.districtName +' District and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};
var camelCase = (str)=>{
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

exports.getCitiesWithId = (req,res,next)=>{
    Cities.find({
    "countryID" : ObjectID(req.params.countryID),
    "stateID"   : ObjectID(req.params.stateID),
    "districtID": ObjectID(req.params.districtID),
    "blockID"   : ObjectID(req.params.blockID)
    })
    .exec()
            .then(data=>{  
            if(data.length>0){   
                    var allData = data.map((x, i)=>{
                        //console.log(x);   
                       
                        return {
                            "_id"                 : x._id,
                            "cityName"            : camelCase(x.cityName)  
                        }
                        })
                        res.status(200).json(allData); 
                }else{
                    res.status(200).json({"message" : 'City not found for this '+ req.params.districtName +' District and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }); 
}
exports.getCitiesByState = (req,res,next)=>{

// Remove these 2 lines after client confirmation. These are temporary lines.
// These two lines are just to reduce the data coming in to website. 
//                "districtName"  :  "Pune",
//                "blockName"     :  "Haveli",
        

        Cities  
        .find({
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :  "Pune",
                "blockName"     :  "Haveli",
              },{districtName:1, blockName:1, cityName:1})
            .sort({"cityName": 1})
            .exec()
            .then(data=>{             
                if(data.length>0){
                    // console.log("getCitiesByState data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(403).json({"message" : 'City not found for this state code: '+ req.params.stateCode });
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};

exports.addCity = (req,res,next)=>{
    // This API is used for Adding/inserting State from UI side
     States.findOne({ "cityName": {'$regex' : req.body.cityName , $options: "i"} })
    .exec()
    .then(state=>{
        if(!state){
            const state = new States({
                _id                     : new mongoose.Types.ObjectId(),                    
                countryCode             : req.body.countryCode,
                countryName             : req.body.countryName,
                stateName               : req.body.stateName,
                stateCode               : req.body.stateCode,
                cityName                : req.body.cityName,
                createdAt               : new Date()
            });

                    
            state.save()
                .then(data=>{
                    res.status(200).json({
                        message: "City inserted successfully",
                    })
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
        }else{
             res.status(200).json({
                message: "City already exist",
            })
        }
    })
}
