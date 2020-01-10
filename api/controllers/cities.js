const mongoose	= require("mongoose");
const async = require("async");

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
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$unwind": "$districtDetails" },
      { "$unwind": "$blockDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName',
                        districtName    : '$districtDetails.districtName',
                        blockName       : '$blockDetails.blockName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } ,
                     "districtName":  { "$regex": req.params.districtName, $options: "i" },
                     "blockName"   :  { "$regex": req.params.blockName, $options: "i" }
                    } 
    }            
    ]).sort({ "cityName": 1 })
    // Cities  .find(
    //         {
    //             "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
    //             "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
    //             "districtName"  :   { "$regex": req.params.districtName, $options: "i"},
    //             "blockName"     :   { "$regex": req.params.blockName, $options: "i"}
    //         },{cityName: 1,pincode:1}).sort({ "cityName": 1 })
            .exec()
            .then(data=>{   
                 console.log(data);     
                if(data.length>0){   
                    var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName, 
                            "stateCode"           : x.stateCode, 
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                            "blockName"           : camelCase(x.blockName),
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
