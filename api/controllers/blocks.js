const mongoose	= require("mongoose");
const async = require("async");

const Blocks = require('../models/blocks');

exports.getBlocks = (req,res,next)=>{ 
    
    Blocks  .find(
            {
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :   { "$regex": req.params.districtName, $options: "i"}
            },{blockName: 1})
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


