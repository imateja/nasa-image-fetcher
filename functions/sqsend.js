'use strict';
const AWS=require('aws-sdk');
AWS.config.update({
region: 'us-east-1'
});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

module.exports.sqsend =  (event) => {

  event.Records.forEach(async element=>{

    if (element.eventName=="MODIFY") {

      const date = new Date();

      const format = date.getFullYear() + "-"+ (date.getMonth() + 1)+ "-"+ date.getDate(); 

      var params = {
        TableName: process.env.TABLE_NAME,
        Key:{
          "date": format
            }
        };

      const data = await docClient.get(params).promise();
      const datum=data.Item.date;
      const expl=data.Item.explanation;
      const title=data.Item.title;
      const inturl = data.Item.internal_url;

      var queueparams = {
        DelaySeconds: 10,
        MessageAttributes: {
          "Title": {
            DataType: "String",
            StringValue: title
          },
          "Date": {
            DataType: "String",
            StringValue: datum
          },
          "internal_url": {
            DataType: "String",
            StringValue: inturl
          }
        },
        MessageBody: expl,
        QueueUrl: process.env.QUEUE_URL
        };

      sqs.sendMessage(queueparams, function(err, data) {
      if (err) {
        console.log("Error", err);
        } 
      else {console.log("Message sent to SQS queue");}});
        } 
        
  });
};