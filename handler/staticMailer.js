const aws = require('aws-sdk');
const sns = new aws.SNS();
const axios = require('axios');

const publishToSNS = (message) => sns.publish({
    Message: message,
    TopicArn: process.env.SNS_TOPIC_ARN
}).promise();

const buildEmailBody = (id, form) => {
    return `
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service information: ${id.sourceIp} - ${id.userAgent}
    `;
}

module.exports.staticMailer = async (event) => {
    console.log("EVENT:::", event);

    const data = JSON.parse(event.body);
    if (typeof data.email !== "string") {
        console.error('Validation error');
        throw new Error('Validation error');
    }

    const emailBody = buildEmailBody(event.requestContext.identity, data);
    await publishToSNS(emailBody);

    await axios.post(
        "https://cckjt5kip7.execute-api.us-east-1.amazonaws.com/dev/subscribe",
        {
            email: data.email
        }
    );

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({ message: "OK" })
    };
}