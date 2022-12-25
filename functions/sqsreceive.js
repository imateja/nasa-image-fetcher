'use strict';
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const ses = new AWS.SES({region:"us-east-1"});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports.sqsreceive = (event) => {

    const queueurl= process.env.QUEUE_URL;
    
    var params = {
      AttributeNames: [
        "SentTimestamp"
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        "All"
      ],
      QueueUrl: queueurl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };  

    const data = event.Records[0].messageAttributes;
    const title = data.Title.stringValue;
    const date = data.Date.stringValue;
    const inturl = data.internal_url.stringValue;
    const expl = event.Records[0].body;

    const emailparams = {
      Source: process.env.EMAIL,
      Destination: {
          ToAddresses: [process.env.EMAIL]
      },
      Message: {
          Subject: {
            Data: 'Picture of the day' + date
          },
          Body: {
            Html: {
              Data: '<h1><a href="' + inturl + '">' + title + '</a></h1><p> ' + expl + ' </p>'
            },
            Text: {
              Data: expl
            }
          }
        }
    };

    ses.sendEmail(emailparams, function(err, data) {
      if (err) {
          console.error(err);
      } else {
          console.log(data);
      }
    });
    
    console.log("Email sent successfuly");

};