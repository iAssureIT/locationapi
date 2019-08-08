const mongoose	= require("mongoose");
const async = require("async");

const SubAreas = require('../models/subareas');

exports.insertSubarea = (req,res,next)=>{ 
    const subarea = new SubAreas({
        _id                       : new mongoose.Types.ObjectId(),
        countryCode     : req.body.countryCode,
        stateName       : req.body.stateName,
        districtName    : req.body.districtName,
        blockName       : req.body.blockName,
        cityName        : req.body.cityName,
        areaName        : req.body.areaName,
        subareaName     : req.body.subareaName
    });
    subarea.save()
    .then(data=>{
        res.status(200).json({
            "message": "Subarea is saved Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

