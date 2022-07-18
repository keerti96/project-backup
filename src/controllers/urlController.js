
//const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const urlModel = require('../models/urlModel')


//<<-------------------------------------------generate shorturl---------------------------------------------------->>
const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl.trim().toLowerCase();
        const baseUrl = "http://localhost:3000"


        const urlCode = shortid.generate();

        if (!Object.keys.length) {
            res.status(400).send({ status: false, message:"Invalid request body parameters!! Request body can't be empty"});
        }

        if(!longUrl){
            res.status(400).send({status: false, message:"longUrl field is missing!! Please provide a longUrl!! "})
        }

        if (!validUrl.isWebUri(longUrl)) {
            res.status(400).send({ status: false, message: "Invalid URL!! Please enter a valid url for shortening"});
        }
        

        if(!longUrl.match(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)){
            res.status(400).send({status: false, message: "Invalid URL!! Please ensure format of url!"});
        }

        let urlData = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0});
        if (urlData) {
            return res.status(200).send({ status: true, data: urlData })
        }

        const shortUrl = baseUrl + "/" + urlCode;
        const input = { longUrl: longUrl, shortUrl: shortUrl, urlCode: urlCode };

        urlData = await urlModel.create(input);

        const displayData = { longUrl: urlData.longUrl, shortUrl: urlData.shortUrl, urlCode: urlData.urlCode }

        return res.status(201).send({ status: true, data: displayData });

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const getUrl = async function (req, res) {
    try {

        let urlCode = req.params.urlCode;
        let urlData = await urlModel.findOne({ urlCode: urlCode });

        if (!urlData) {
            res.status(404).send({ status: false, message:"urlCode not found!"});
        }

        console.log("Redirecting to the url!!")
        return res.status(302).redirect(urlData.longUrl);


    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createUrl, getUrl }
