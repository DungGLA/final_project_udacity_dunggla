import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTableName = process.env.TODOS_TABLE
const indexName = process.env.TODOS_CREATED_AT_INDEX
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpired = process.env.SIGNED_URL_EXPIRATION

export async function queryAllTodos(userId: string) {
    const response = await docClient.query({
        TableName: todosTableName,
        IndexName: indexName,
        ScanIndexForward: true,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
    }).promise()
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ items: response.Items })
    }
}

export async function createNewTodo(payload: TodoItem) {
    try {
        await docClient.put({
            TableName: todosTableName,
            Item: payload
        }).promise()
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ items: payload })
        }
    } catch (error) {
        console.log('Something is wrong')
    }
    
}