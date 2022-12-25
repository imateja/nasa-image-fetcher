'use strict';
var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({
region: 'us-east-1'
});
const https = require('https');

module.exports.bucketinsert = (event) => {

  event.Records.forEach((element) => {
    if (element.eventName=="INSERT") {

      const imageUrl = element.dynamodb.NewImage.url.S;
      const kljuc = element.dynamodb.NewImage.date.S;

      https.get(imageUrl, (response) => {
        let data = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {

      s3.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: kljuc,
        Body: Buffer.concat(data),
        Type: "image"
        }, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Upload successful");
        }
          });
          
        });
      });
    } 
  });
}; 