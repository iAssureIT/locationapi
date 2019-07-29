const mongoose	= require("mongoose");
const async = require("async");

const Areas = require('../models/areas');

exports.getAreas = (req,res,next)=>{
    
    Areas  .find({"countryCode": req.params.countryCode,  "stateCode":req.params.stateCode,
                    "districtName":req.params.districtName, "blockName":req.params.blockName,
                    "cityName": req.params.countryCode
                    },{areaName: 1})
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Area not found for this '+ req.params.districtName +' district and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}


