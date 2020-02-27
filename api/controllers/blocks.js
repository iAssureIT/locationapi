const mongoose	= require("mongoose");
const async = require("async");

const Blocks = require('../models/blocks');
 
exports.getBlocks = (req,res,next)=>{ 
    Blocks.aggregate([
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
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$unwind": "$districtDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName',
                        districtName    : '$districtDetails.districtName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } ,
                     "districtName":  { "$regex": req.params.districtName, $options: "i" } } 
    }            
    ]).sort({ "blockName": 1 })
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
                            "blockName"           : camelCase(x.blockName),
                        }
                        })
                        res.status(200).json(allData);
                }else{
                    res.status(200).json({"message" : 'Block not found for this '+ req.params.stateCode +' State Code and '+req.params.districtName+' District'});
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
exports.getBlocksByState = (req,res,next)=>{ 
    // console.log(req.params);

    Blocks.aggregate([
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
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$unwind": "$districtDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName',
                        districtName    : '$districtDetails.districtName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } } 
    }            
    ]).sort({ "blockName": 1 })

            .exec()
            .then(data=>{
                //console.log(data);
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Block not found for this '+ req.params.stateCode +' State Code'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}