const mongoose	= require("mongoose");
const async = require("async");

const SubAreas = require('../models/subareas');

exports.insertSubarea = (req,res,next)=>{ 
    const subarea = new SubAreas({
        _id             : new mongoose.Types.ObjectId(),
        countryCode     : req.body.countryCode,
        stateCode       : req.body.stateCode,
        districtName    : req.body.districtName,
        blockName       : req.body.blockName,
        cityName        : req.body.cityName,
        areaName        : req.body.areaName,
        subareaName     : req.body.subareaName,
        status          : "new"
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
};

exports.getSubAreas = (req,res,next)=>{
    // console.log(req.params);
        SubAreas  
            .find({
                "stateCode"        :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"     :   { "$regex": req.params.districtName, $options: "i"},
                "blockName"        :   { "$regex": req.params.blockName, $options: "i"},
                "cityName"         :   { "$regex": req.params.cityName, $options: "i"},
                "areaName"         :   { "$regex": req.params.areaName, $options: "i" },
                "status"           :   "approved"
            })
            .sort({ "subareaName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    // console.log("getSubAreas data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'SubAreas not found for '+ req.params.cityName +' district, '+req.params.areaName+' block',});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}


exports.update_status = (req,res,next)=>{
    SubAreas.updateOne(
            {
                "stateCode"        :   { "$regex": req.body.stateCode, $options: "i"},
                "districtName"     :   { "$regex": req.body.districtName, $options: "i"},
                "blockName"        :   { "$regex": req.body.blockName, $options: "i"},
                "cityName"         :   { "$regex": req.body.cityName, $options: "i"},
                "areaName"         :   { "$regex": req.body.areaName, $options: "i" },
                "subareaName"      :   { "$regex": req.body.subareaName, $options: "i" }
            },  
            {
                $set:  { 'status' : req.body.status }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Subarea is Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Subarea Not Found"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};




exports.searchSubAreas = (req,res,next)=>{
    // console.log(req.params);;
    var selector = {
                $or : [
                    {"cityName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"areaName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"subareaName"      :   { "$regex": req.params.searchText, $options: "i"} },
                ],
                "status"           :   "approved"
            };
    // console.log("selector = ", JSON.stringify(selector)); 

    SubAreas.find(selector)
            .sort({cityName:1,areaName:1,subareaName:1})
            .exec()
            .then(data=>{
                if(data.length>0){
                    console.log("getSubAreas data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'SubAreas not found for this '+ req.params.districtName +' district and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}


exports.updateSubarea = (req,res,next)=>{
    SubAreas.updateOne(
            {
                "_id"        :   req.body.locationId,
            },   
            {
                $set:  { 'subareaName' : req.body.subareaName }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "subarea is Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "subarea Not Found"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

