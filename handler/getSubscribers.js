const AWS = require("aws-sdk");
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getSubscribers = async (event, context) => {
    const params = {
        TableName: USERS_TABLE
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
        
        return response;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}