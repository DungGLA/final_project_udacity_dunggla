import { queryAllTodos, createNewTodo, updateTodoById, deleteTodoById, generateUrlById } from './todosAcess'
import { getUploadUrlById } from './attachmentUtils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic ==> DONE
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
    await generateUrlById(userId, todoId)
    return getUploadUrlById(todoId)
}