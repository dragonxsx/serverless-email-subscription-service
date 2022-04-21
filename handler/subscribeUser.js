const aws = require('aws-sdk');
const uuid =require('uuid');
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.subscribeUser = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log("EVENT:::", data);

    if(typeof data.email !== "string") {
        console.error("Validation failed");
        throw new Error("Validation failed");
    }

    const id = uuid.v4();
    const timestamp = new Date().getTime();

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: id,
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    try {
        await dynamoDb.put(params).promise();

        const data = await dynamoDb.get({
            TableName: USERS_TABLE,
            Key: {userId: id},
            ConsistentRead: true
        }).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        return response;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
};