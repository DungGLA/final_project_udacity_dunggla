import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const AWSXRay = require('aws-xray-sdk')

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic ==> DONE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTableName = process.env.TODOS_TABLE
const indexName = process.env.TODOS_CREATED_AT_INDEX
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET

export async function queryAllTodos(userId: string) {
    logger.info('Start query all todos')
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
        logger.info('Start create new todo')
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
        logger.error(`Error create new todo: ${error.message}`)
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: `Something is wrong: ${error.message}`
        }
    }
    
}

async function checkExistedTodo(userId: string, todoId: string) {
    logger.info('Start check existed todo')
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
            logger.info('Start update todo by id')
            await docClient.update({
                TableName: todosTableName,
                Key: { userId, todoId },
                UpdateExpression: 'set #todoName = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    "#todoName": "name"
                },
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
                body: `Something is wrong: ${error.message}`
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
                body: 'Delete Successfully'
            }
        } catch (error) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: `Something is wrong: ${error.message}`
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
                body: `Something is wrong: ${error.message}`
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
