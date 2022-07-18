
//const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const urlModel = require('../models/urlModel')


//<<-------------------------------------------generate shorturl---------------------------------------------------->>
const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl;
        const baseUrl = "http://localhost:3000"

        // if(!validUrl.isUri(baseUrl)){
        //     return res.status(401).json("Internal error. Please come back later.");
        // }

        const urlCode = shortid.generate();

        if (!validUrl.isUri(longUrl)) {
            res.status(400).json("Invalid URL!! Please enter a valid url for shortening");
        }


        let url = await urlModel.findOne({ longUrl: longUrl });
         if(url){
             return  res.status(200).json(url);
         }

        const shortUrl = baseUrl + "/" + urlCode;
        url = new urlModel({
            longUrl,
            shortUrl,
            urlCode,
            clickCount: 0
        });

        await url.save()
        return res.status(201).json(url);
    
    //     //<----create a user document---->
    //     const savedData = await userModel.create(requestBody)
    // return res.status(201).send({ status: true, message: 'Success', data: savedData })
}
    catch (err) {
    res.status(500).send({ status: false, error: err.message })
}
}


module.exports = {createUrl}