const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION, 
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const sqs = new AWS.SQS();
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL; 
const ses = new AWS.SES();

module.exports = { sqs, SQS_QUEUE_URL,ses };
