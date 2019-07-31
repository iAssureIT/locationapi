const mongoose	= require("mongoose");
const async = require("async");

const Blocks = require('../models/blocks');

exports.getBlocks = (req,res,next)=>{ 
    
    Blocks  .find({"countryCode": req.params.countryCode,"stateCode":req.params.stateCode,
                    "districtName":  req.params.districtName},{blockName: 1})
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
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


