import { queryAllTodos, createNewTodo, updateTodoById, deleteTodoById, generateUrlById } from '../dataLayer/todosAcess'
import { getUploadUrlById } from '../fileStorage/attachmentUtils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'

// TODO: Implement businessLogic ==> DONE
const logger = createLogger('todos')
export async function getAllTodos(userId: string) {
    return queryAllTodos(userId)
}

export async function createTodo(userId: string, todoRequest: CreateTodoRequest) {
    const todoId = uuid.v4()
    const payload = {
        userId,
        todoId,
        createdAt: new Date(Date.now()).toISOString(),
        done: false,
        ...todoRequest
    }
    return await createNewTodo(payload)
}

export async function updateTodo(userId: string, todoId: string, todoRequest: UpdateTodoRequest) {
    return await updateTodoById(userId, todoId, todoRequest)
}

export async function deleteTodo(userId: string, todoId: string) {
    return await deleteTodoById(userId, todoId)
}

export async function generateUploadUrl(userId: string, todoId: string) {
    try {
        await generateUrlById(userId, todoId)
        const uploadUrl = getUploadUrlById(todoId)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ uploadUrl })
        }
    } catch (error) {
        logger.error(`Error generate url ${error.message}`)
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