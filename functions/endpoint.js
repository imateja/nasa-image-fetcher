'use strict';
const AWS=require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

module.exports.endpoint = async (event,context) => {

  const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  const params = {
    TableName: process.env.TABLE_NAME,
    FilterExpression: ':date >= :sevenDaysAgo',
    ExpressionAttributeValues: {
      ':sevenDaysAgo': Date.now() - 7 * 24 * 60 * 60 * 1000,
      ':date': Date.now()
    }
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    const imagesHTML = data.Items
      .map(item =>
        `<h1>Picture of the day ${item.date}:
          <a href="${item.internal_url}">${item.title}</a>
        </h1>
        <h3>${item.explanation}</h3>
        <img src="${item.url}" />
        <br>`
      ).join('');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <body>
            ${imagesHTML}
          </body>
        </html>
      `
    };
    } 
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving items.' })
    };
  }
};