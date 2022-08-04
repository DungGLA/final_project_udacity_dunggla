import * as React from 'react'
// import Auth from '../auth/Auth'
// import { Todo } from '../types/Todo'
// import {
//     Button,
//     Checkbox,
//     Divider,
//     Grid,
//     Icon,
//     Image,
//   } from 'semantic-ui-react'

// interface TodoProps {
//     match: {
//         params: {
//           todoId: string
//         }
//       }
//     auth: Auth
//   }
// interface TodoState {
//     todo: Todo
// }
// export class ViewTodo extends React.PureComponent<TodoProps, TodoState> {
//     state: TodoState = {
//         todo: {} as Todo
//     }
//     render() {
//         const todo = localStorage.getItem('todo');
//         if (todo) {
//             // eslint-disable-next-line react/no-direct-mutation-state
//             this.state.todo = JSON.parse(todo)
//         }
//         return (
//           <div>
//             <h1>Todo Detail</h1>
//             {this.renderTodo()}
//           </div>
//         )
//       }
//     renderTodo() {
//         return (
//               <Grid padded>
//                   <Grid.Row key={this.props.match.params.todoId}>
//                       <Grid.Column width={1} verticalAlign="middle">
//                           <Checkbox
//                           disabled
//                           checked={this.state.todo.done}
//                           />
//                       </Grid.Column>
//                       <Grid.Column width={8} verticalAlign="middle">
//                           {this.state.todo.name}
//                       </Grid.Column>
//                       <Grid.Column width={3} floated="right">
//                           {this.state.todo.dueDate}
//                       </Grid.Column>
//                       {this.state.todo.attachmentUrl && (
//                           <Image src={this.state.todo.attachmentUrl} size="small" wrapped />
//                       )}
//                       <Grid.Column width={16}>
//                           <Divider />
//                       </Grid.Column>
//                   </Grid.Row>
//               </Grid>
//           )
//     }
// }
