const mongoose	= require("mongoose");
const async = require("async");

const Areas = require('../models/areas');

exports.getAreas = (req,res,next)=>{
    
    Areas  .find(
            {
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :   { "$regex": req.params.districtName, $options: "i"},
                "blockName"     :   { "$regex": req.params.blockName, $options: "i"}
            }).sort({ "areaName": 1 })
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


exports.getAreaByPincode = (req,res,next)=>{ 
    
    Areas  .find({"pincode": req.params.pincode})
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Area not found for this '+ req.params.pincode +' Pincode'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}