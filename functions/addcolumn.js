'use strict';
const AWS=require('aws-sdk');

AWS.config.update({
region: 'us-east-1'
});

const s3 = new AWS.S3({
region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient({region :'us-east-1'});

module.exports.addcolumn = (event) => {
  event.Records.forEach( element=>{
  
  const kljuc = event.Records[0].s3.object.key;
  console.log(kljuc);
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: kljuc,
    Expires: 604800
  });

  const date = new Date();
  
  const format = date.getFullYear() + "-"+ (date.getMonth() + 1)+ "-"+ date.getDate(); 
  
  const newColumnName= "internal_url";

  const updateParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      "date": format
    },
    UpdateExpression: "set #MyVariable = :y",
    ExpressionAttributeNames: {
      "#MyVariable": newColumnName
    },
    ExpressionAttributeValues: {
      ":y": url
    }
  };

  docClient.update(updateParams).promise().then((data) => {
    console.log(url);
  }).catch((err) => {
    console.error(err);});
  });

};