const mongoose	= require("mongoose");
const async = require("async");

const States = require('../models/states');

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


