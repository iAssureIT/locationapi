const mongoose	= require("mongoose");
const async = require("async");

const Areas = require('../models/areas');

exports.getAreas = (req,res,next)=>{
    
    Areas  .find({
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :   { "$regex": req.params.districtName, $options: "i"},
                "blockName"     :   { "$regex": req.params.blockName, $options: "i"}
                "cityName"      :   { "$regex": req.params.cityName, $options: "i"}
            })
            .sort({ "areaName": 1 })
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


exports.searchByAreaBlockDistrictString = (req,res,next)=>{ 
    
    Areas  .find(
                { "$or": 
                    [
                    {"districtName" : {'$regex' : '^' + req.params.string , $options: "i"}},
                    {"blockName"    : {'$regex' : '^' + req.params.string , $options: "i"}},
                    {"areaName"     : {'$regex' : '^' + req.params.string , $options: "i"} } 
                    ] 
                }
            )
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


exports.areaDetails = (req,res,next)=>{ 
    
    Areas  .find(
                    {"areaName"     : { "$regex": req.params.area, $options: "i"} }
            )
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

