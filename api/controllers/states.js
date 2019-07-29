const mongoose	= require("mongoose");
const async = require("async");

const States = require('../models/states');

exports.getAllStates = (req,res,next)=>{

    var selector = {"countryCode": req.params.countryCode};

    var filter = {stateCode: 1, stateName:1};

    States  .find(selector)
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


