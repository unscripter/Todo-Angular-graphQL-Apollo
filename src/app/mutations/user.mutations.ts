import gql from 'graphql-tag';
const name = 'name', status = 'status', id = 'id';
const todoCount = 'todoNo', active = 'active', completed = 'completed';
const ok = 'ok';

export const todoMutation = {

FETCH_TODOS : gql`
query Mutation {
 fetchTodos {
   ${name}, ${status}, ${id}
 }
}`,

ADD_TODO: gql`
mutation Mutation($name: String!, $status: String!, $id: Int!) {
    addTodo(
    name: $name,
    status: $status,
    id: $id
    ) {
    ${name}, ${status}, ${id}
    }
}`,

EDIT_TODO : gql`
mutation Mutation($status: String!,  $id: Int!) {
    updateTodo(
    status: $status,
    id: $id
    ){
    ${name}, ${status}, ${id}
    }
}`,

DELETE_TODO :  gql`
mutation Mutation($id: Int!){
    deleteTodo(id: $id){
    ${name}, ${status}, ${id}
    }
}`,

CHANGE_STATUS_FOR_ALL :  gql`
mutation Mutation($status: String!){
    statusBasedUpdate(status: $status){
    ${ok}
    }
}`,

GET_STATUS_BASED_TODOS : gql`
query QueryType($status: String!) {
    statusBasedTodos(status: $status) {
    ${name}, ${status}, ${id}
    }
}`,

GET_STATUS_BASED_COUNT : gql`
query QueryType {
    overall {
      ${todoCount}, ${active}, ${completed}
    }
   }
`
}