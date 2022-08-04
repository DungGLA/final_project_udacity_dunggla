import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodos as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

// TODO: Get all TODO items for a current user ==> DONE
const logger = createLogger('getTodos')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('Processing event: ', event)
    const searchValue = event.queryStringParameters?.searchValue
    console.log(searchValue)
    const userId = getUserId(event)
    const search = searchValue || ''
    return await getTodosForUser(userId, search.trim())
  })
handler.use(
  cors({
    credentials: true
  })
)
