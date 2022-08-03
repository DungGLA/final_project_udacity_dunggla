import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic ==> DONE
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
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: 'Something is wrong'
        }
    }
    
}

async function checkExistedTodo(userId: string, todoId: string) {
    const response = await docClient.get({
        TableName: todosTableName,
        Key: { userId, todoId }
    }).promise()
    return !!response.Item
}

export async function updateTodoById(userId: string, todoId: string, payload: TodoUpdate) {
    const isExistedTodo = await checkExistedTodo(userId, todoId)
    if (isExistedTodo) {
        try {
            await docClient.update({
                TableName: todosTableName,
                Key: { userId, todoId },
                UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues: {
                    ':name': payload.name,
                    ':dueDate': payload.dueDate,
                    ':done': payload.done
                }
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
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: 'Something is wrong'
            }
        }
    }
    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: 'Todo is not existed.'
    }
}

export async function deleteTodoById(userId: string, todoId: string) {
    const isExistedTodo = await checkExistedTodo(userId, todoId)
    if (isExistedTodo) {
        try {
            await docClient.delete({
                TableName: todosTableName,
                Key: { userId, todoId },
            }).promise()
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: {}
            }
        } catch (error) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: 'Something is wrong'
            }
        }
    }
    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: 'Todo is not existed.'
    }
}

export async function generateUrlById(userId: string, todoId: string) {
    const isExistedTodo = await checkExistedTodo(userId, todoId)
    if (isExistedTodo) {
        try {
            const url = `https://${s3Bucket}.s3.amazonaws.com/${todoId}`
            await docClient.update({
                TableName: todosTableName,
                Key: { userId, todoId },
                UpdateExpression: 'set attachmentUrl = :url',
                ExpressionAttributeValues: { ':url': url }
            }).promise()
            return {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: {}
            }
        } catch (error) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: 'Something is wrong'
            }
        }
    }
    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: 'Todo is not existed.'
    }
}

export function getUploadUrlById(todoId: string) {
    const s3 = new XAWS.S3({ signatureVersion: 'v4' })
    return s3.getSignedUrl('putObject', {
        Bucket: s3Bucket,
        Key: todoId,
        Expires: urlExpired
    })
}