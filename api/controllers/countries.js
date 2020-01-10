const mongoose	= require("mongoose");
const async = require("async");
const Countries = require('../models/countries');
const _         = require("underscore");
const parseSchema = require('mongodb-schema');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'locations';

exports.getAllCountries = (req,res,next)=>{

    Countries.find().sort({ "countryName": 1 })
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
exports.insertCountry = (req,res,next)=>{
    const country = new Countries({
        _id                     : new mongoose.Types.ObjectId(),                    
        countryCode             : req.body.countryCode,
        countryName             : req.body.countryName,
        fileName                : data.fileName,
        createdAt               : new Date()
        });
        
        country
        .save()
        .then(data=>{
            resolve(data._id);
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
};