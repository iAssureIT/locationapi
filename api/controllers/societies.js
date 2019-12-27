const mongoose  = require("mongoose");
const async = require("async");

const Societies = require('../models/societies');
const SubAreas = require('../models/subareas');
const axios    = require('axios');

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


//Get unApproved Societies list
exports.getUnapprovedSociety = (req,res,next)=>{
    
        Societies  .find(
            {"status" : "new"}).sort({ "areaName": 1 })
            .exec()
            .then(unApprovedSocieties=>{
                main();
                async function main(){
                if(unApprovedSocieties.length>0){
                    var dataList = [];
                   
                    for (var i = 0; i < unApprovedSocieties.length; i++) {
                        var formValues = {
                            societyName : unApprovedSocieties[i].societyName,
                            subareaName : unApprovedSocieties[i].subareaName,
                        }
                        
                            var propList         = await getPropertyList(formValues,req.body.url);
                            console.log("propList=>",propList);
                            dataList.push({
                                _id             : unApprovedSocieties[i]._id,
                                countryCode     : unApprovedSocieties[i].countryCode,
                                stateCode       : unApprovedSocieties[i].stateCode,
                                districtName    : unApprovedSocieties[i].districtName,
                                blockName       : unApprovedSocieties[i].blockName,
                                cityName        : unApprovedSocieties[i].cityName,
                                areaName        : unApprovedSocieties[i].areaName,
                                status          : unApprovedSocieties[i].status,
                                societyName     : unApprovedSocieties[i].societyName,
                                subareaName     : unApprovedSocieties[i].subareaName,
                                propList        : propList
                            });
                             console.log("dataList=>",dataList);

                    } 
                        
                    if(i >= unApprovedSocieties.length){
                        console.log("dataList",dataList);
                        res.status(200).json(dataList);
                    }

                }else{
                    res.status(200).json({"message" : 'society not found for this '+ req.params.districtName +' district and '+req.params.blockName+' block'});
                }
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
    });
}

function getPropertyList(formValues,url){
    return new Promise(function(resolve,reject){
        console.log("formValues=>",formValues);
        console.log("url=>",url);
        axios.post(url+'/api/properties/post/locationProperties',formValues)
        .then((propertyList) => {
            if(propertyList.data){
                resolve(propertyList.data);    
            }
        })
        .catch((error)=>{
           console.log("error=>",error);
        });
    });
};


exports.update_status = (req,res,next)=>{
    console.log("Req = ", req.body);

    Societies
        .findOne({"_id"        :   req.body.societies_id})
        .then((societyDetails)=>{
            var oldSubareaName = societyDetails.subareaName; 
            console.log("oldSubareaName=>",oldSubareaName);
            Societies.updateOne(
                    {"_id"        :   req.body.societies_id,},  
                    {
                        $set:  { 
                            'subareaName' : req.body.subareaName,  
                            'societyName' : req.body.societyName, 
                            'status'      : req.body.status 
                        }
                    }
                )
                .exec()
                .then(societyData=>{
                        //Now Modify the SubArea Name also
                        SubAreas.updateOne(
                            {"subareaName" : oldSubareaName},  
                            {
                                $set:  { 
                                    'subareaName' : req.body.subareaName,  
                                    'status'      : req.body.status 
                                }
                            }                
                        )
                        .then((subAreaData)=>{
                                res.status(200).json({
                                    "message": "Society & SubArea are Updated Successfully."
                                });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                "message": "Subarea Update has some issue",
                                error: err
                            });
                        });

                    
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        message: "Society Update has some issue.",
                        error: err
                    });
                });


        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message: "Society FindOne has some Issue",
                error: err
            });
        });
};

exports.reject_status = (req,res,next)=>{
    console.log("Req = ", req.body);
    Societies.updateOne(
            {"_id"        :   req.body.societies_id},  
            {
                $set:  {  
                    'status'      : req.body.status 
                }
            }
        )
        .exec()
        .then((societiesData)=>{
                res.status(200).json({
                    "message": "Society rejected."
                });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message: "Society updateone has some Issue",
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

