const mongoose	= require("mongoose");
const async = require("async");

const Districts = require('../models/districts');

exports.getDistricts = (req,res,next)=>{
    
    Districts   .find(
                {
                    "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                    "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"}
                },
                {districtName: 1},

                ).sort({ "districtName": 1 })
                .exec()
                .then(data=>{
                    if(data.length>0){
                        res.status(200).json(data);
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


