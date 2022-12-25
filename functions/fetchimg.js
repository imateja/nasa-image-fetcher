'use strict';

const axios = require('axios');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

module.exports.fetchimg = async (event) => {

    const {data: imageData} = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    );

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            copyright: imageData.copyright,
            date: imageData.date,
            explanation: imageData.explanation,
            hdurl: imageData.hdurl,
            media_type: imageData.media_type,
            service_version: imageData.service_version,
            title: imageData.title,
            url: imageData.url
        }
    };

    await documentClient.put(params).promise()
        .then((data) => {
            console.log("Items are succesfully ingested in table ..................");
                })
        .catch((err) => {
            console.error(err);
                });
};