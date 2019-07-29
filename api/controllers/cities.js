const mongoose	= require("mongoose");
const async = require("async");

const Cities = require('../models/cities');

exports.getCities = (req,res,next)=>{
    
    Cities  .find({"countryCode": req.params.countryCode,"stateCode":req.params.stateCode,
                    "districtName":req.params.districtName,"blockName":req.params.blockName},{cityName: 1,pincode:1})
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
}


exports.getAreaByPincode = (req,res,next)=>{ 
    
    Cities  .find({"pincode": req.params.pincode})
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