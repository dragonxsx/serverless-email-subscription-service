const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3();

module.exports.getQuotes = async (event, context) => {
    console.log("Incomming:::", event);

    try {
        const file = await s3.getObject({
            Bucket: 'dragonxsx-my-quoute-bucket',
            Key: 'quotes.json'
        }).promise();

        const json = JSON.parse(file.Body);
        console.log("JSON:::", json);

        // create a response
        const response = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 200,
            body: JSON.stringify(json)
        }

        return response;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}