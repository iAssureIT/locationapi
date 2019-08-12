const mongoose	= require("mongoose");
const async = require("async");

const Cities = require('../models/cities');

exports.getCities = (req,res,next)=>{
    
    Cities  .find(
            {
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :   { "$regex": req.params.districtName, $options: "i"},
                "blockName"     :   { "$regex": req.params.blockName, $options: "i"}
            },{cityName: 1,pincode:1}).sort({ "cityName": 1 })
            .exec()
            .then(data=>{             
                if(data.length>0){    
                    res.status(200).json(data);
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
                    console.log("getCitiesByState data = ", data);
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


