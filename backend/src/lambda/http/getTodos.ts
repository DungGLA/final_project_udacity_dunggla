import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user ==> DONE
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    return await getTodosForUser(userId)
  })
handler.use(
  cors({
    credentials: true
  })
)
