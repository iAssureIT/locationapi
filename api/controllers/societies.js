const mongoose	= require("mongoose");
const async = require("async");

const Societies = require('../models/societies');

exports.insertsociety = (req,res,next)=>{ 
    const society = new Societies({
        _id             : new mongoose.Types.ObjectId(),
        countryCode     : req.body.countryCode,
        stateCode       : req.body.stateCode,
        districtName    : req.body.districtName,
        blockName       : req.body.blockName,
        cityName        : req.body.cityName,
        areaName        : req.body.areaName,
        subareaName     : req.body.subareaName,
        societyName     : req.body.societyName,
        status          : "new"
    });
    society.save()
    .then(data=>{
        res.status(200).json({
            "message": "society is saved Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.getsociety = (req,res,next)=>{
    
    Societies  .find(
            {
                "stateCode"        :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"     :   { "$regex": req.params.districtName, $options: "i"},
                "blockName"        :   { "$regex": req.params.blockName, $options: "i"},
                "cityName"         :   { "$regex": req.params.cityName, $options: "i"},
                "areaName"         :   { "$regex": req.params.areaName, $options: "i" },
                "subareaName"      :   { "$regex": req.params.subareaName, $options: "i" },
                "status"           :   "approved"
            }).sort({ "areaName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'society not found for this '+ req.params.districtName +' district and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};



exports.searchSocieties = (req,res,next)=>{
    console.log(req.params);
    var selector = {
                $or : [
                    {"cityName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"areaName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"subareaName"      :   { "$regex": req.params.searchText, $options: "i"} },
                    {"societyName"      :   { "$regex": req.params.searchText, $options: "i"} },
                ],
                "status"           :   "approved"
            };
    // console.log("selector = ", JSON.stringify(selector)); 

    Societies.find(selector)
            .sort({cityName:1,areaName:1,subareaName:1, societyName:1})
            .exec()
            .then(data=>{
                if(data.length>0){
                    console.log("getSocieties data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Search Text not found in City, Area, Subarea & Society'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};



exports.getUnapprovedSociety = (req,res,next)=>{
    
    Societies  .find(
            { "status"           :   {$ne: "approved"} }).sort({ "areaName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'society not found for this '+ req.params.districtName +' district and '+req.params.blockName+' block'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}

// exports.update_status = (req,res,next)=>{
//     Societies.updateOne(
//             {
//                 "stateCode"        :   { "$regex": req.body.stateCode, $options: "i"},
//                 "districtName"     :   { "$regex": req.body.districtName, $options: "i"},
//                 "blockName"        :   { "$regex": req.body.blockName, $options: "i"},
//                 "cityName"         :   { "$regex": req.body.cityName, $options: "i"},
//                 "areaName"         :   { "$regex": req.body.areaName, $options: "i" },
//                 "subareaName"      :   { "$regex": req.body.subareaName, $options: "i" },
//                 "societyName"      :   { "$regex": req.body.societyName, $options: "i" }

//             },  
//             {
//                 $set:  { 'status' : req.body.status }
//             }
//         )
//         .exec()
//         .then(data=>{
//             if(data.nModified == 1){
//                 res.status(200).json({
//                     "message": "Society is Updated Successfully."
//                 });
//             }else{
//                 res.status(401).json({
//                     "message": "Society Not Found"
//                 });
//             }
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

exports.update_status = (req,res,next)=>{
    console.log("Req = ", req.body);

    Societies.updateOne(
            {
                "_id"        :   req.body.societies_id,
            },  
            {
                $set:  { 
                    'status' : req.body.subareaName,  
                    'status' : req.body.societyName, 
                    'status' : req.body.status 
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Society is Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Society Not Found"
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

exports.updateSociety = (req,res,next)=>{
    Societies.updateOne(
            {
                "_id"        :   req.body.locationId,
            },   
            {
                $set:  { 'societyName': req.body.societyName }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Society is Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Society Not Found"
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
exports.searchSocieties = (req,res,next)=>{
    console.log(req.params);
    var selector = {
                $or : [
                    {"cityName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"areaName"         :   { "$regex": req.params.searchText, $options: "i"} },
                    {"subareaName"      :   { "$regex": req.params.searchText, $options: "i"} },
                    {"societyName"      :   { "$regex": req.params.searchText, $options: "i"} },
                ],
                "status"           :   "approved"
            };
    // console.log("selector = ", JSON.stringify(selector)); 

    Societies.find(selector)
            .sort({cityName:1,areaName:1,subareaName:1, societyName:1})
            .exec()
            .then(data=>{
                if(data.length>0){
                    console.log("getSocieties data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Search Text not found in City, Area, Subarea & Society'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}

