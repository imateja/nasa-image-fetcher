# Nasa Image Fetcher utilizing AWS and Serverless framework
## Features
The entire program is chained together with AWS Lambda functions that trigger themselves one by one every day at 12PM using cron:
- Fetch picture of the day from NASA APOD API using axios library
- Update DynamoDB tables and create S3 bucket objects
- Generate S3 presigned URLs to download the images
- Send and receive messages with SQS queues using DynamoDB streams
- Use message content to receive and email about APOD every day at a desired time
- Generate and access an HTTP endpoint that displays images from the last 7 days

## Installation
Requires Node and npm alongside a few npm packages:
```sh
cd nasa-image-fetcher
npm i axios
npm i serverless
```
To create a Serverless project and deploy it to AWS, run
```sh
serverless
sls deploy
```
## Lambda Functions
The code is composed out of 6 Lambda functions that do all the work.
All of them are located in the functions/ folder.
| Function | Usage |
| ------ | ------ |
| [fetchImage](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/fetchimage.js) | use axios to get image data and insert into dynamoDB |
| [bucketInsert](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/bucketinsert.js) | get dynamoDB record and create s3 bucket object |
| [addColumn](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/addcolumn.js) | get new s3 bucket object, create presigned url and update dynamoDB record |
| [sqSend](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/sqsend.js) | get dynamoDB record and send it to sqs queue |
| [sqsReceive](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/sqsreceive.js) | receive message from sqs queue, create and send an email |
| [endpoint](https://github.com/yazecchi/nasa-image-fetcher/blob/main/functions/endpoint.js) | renders an html with pictures from the last 7 days via API gateway invocation url |

## Personal usage
You will need to update environment function variables in the `$serverless.yml` file with your own data before deployment:
- Your own NASA API key
- Your own table and bucket names
- Your own sqs queue url and arn
- Your own email