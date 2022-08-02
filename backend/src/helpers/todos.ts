import { queryAllTodos, createNewTodo } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { parseUserId } from '../auth/utils';

// TODO: Implement businessLogic
export async function getAllTodos(token:string) {
    const userId = parseUserId(token)
    return queryAllTodos(userId)
}

export async function createTodo(token: string, todoRequest: CreateTodoRequest) {
    const userId = parseUserId(token)
    const todoId = uuid.v4()
    const payload = {
        userId,
        todoId,
        createdAt: new Date(Date.now()).toISOString(),
        done: false,
        ...todoRequest
    }
    await createNewTodo(payload)
}