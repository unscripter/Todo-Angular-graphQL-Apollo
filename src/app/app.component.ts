import { Component, OnInit } from '@angular/core';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { todoMutation } from './mutations/user.mutations';

interface AsyncIterator<T> {
  next(value?: any): Promise<IteratorResult<T>>;
  return?(value?: any): Promise<IteratorResult<T>>;
  throw?(e?: any): Promise<IteratorResult<T>>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos = [];
  todo = {
    status: 'active',
    text: '',
  };
  show = true;
  totalUsers = null;
  todosCount = {
    all: 0,
    active: 0,
    completed: 0
  };
  constructor(private _apollo: Apollo, private _httpLink: HttpLink) {
  }
  ngOnInit () {
    this.fetchTodosAndCount();
  }

  fetchTodosAndCount () {
    this.fetchTodosCount();
    this.getTodosList();
  }

  // getActiveAndCompletedInitialCount () {
  //   this.todos.map( todo => {
  //     if (todo.val.status === 'active') {
  //       this.todosCount.active++;
  //     } else if (todo.val.status === 'completed') {
  //       this.todosCount.completed++;
  //     }
  //   });
  // }

addTodo() {
  const id = this.todos.length + 1;
  this._apollo.mutate({
  mutation: todoMutation.ADD_TODO,
    variables: {
      status : 'active',
      name: this.todo.text,
      id: id
  }
  }).subscribe(({data}) => {
    this.fetchTodosAndCount();
  });
  this.reInitializeFormData();
}

deleteTodo (id) {
  this._apollo.mutate({
  mutation: todoMutation.DELETE_TODO,
    variables: {
      id: id
    },
    fetchPolicy: 'network-only'
  }).subscribe(({data}) => {
    this.fetchTodosAndCount();
  });
}

fetchTodosCount () {
  this._apollo.query({
    query: todoMutation.GET_STATUS_BASED_COUNT,
    fetchPolicy: 'network-only'
  }).subscribe(({data}) => {
    this.todosCount.all = data.overall.todoNo;
    this.todosCount.active = data.overall.active;
    this.todosCount.completed = data.overall.completed;
  });
}

statusBasedTodos (status) {
  debugger
  this._apollo.query({
    query: todoMutation.GET_STATUS_BASED_TODOS,
    variables: {
      status: status
    },
    fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      debugger;
      let todos = data.statusBasedTodos;
      this.todos = this.createArrayFromObj(todos);
    });
}

changeStatusForAll (status) {
  this._apollo.mutate({
    mutation: todoMutation.CHANGE_STATUS_FOR_ALL,
      variables: {
        status: status
      }
    }).subscribe(({data}) => {
      this.fetchTodosAndCount();
      console.log("COUNT FETCHED");
    });
}

changeTodoStatus (id, status) {
  this.show = true;
  this._apollo.mutate({
    mutation: todoMutation.EDIT_TODO,
    variables: {
      status : status,
      id: id
  }
  }).subscribe(({data}) => {
    this.fetchTodosAndCount();
  });
}

getTodosList () {
    this._apollo.query({
      query: todoMutation.FETCH_TODOS,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      debugger
      this.todos = [];
      const todos = data.fetchTodos;
      this.todos = this.createArrayFromObj (todos);
      this.todosCount.all = this.todos.length;
    });
}

createArrayFromObj (todos) {
  let todosClone = [];
  debugger
  Object.keys(todos).map(key => {
    let temp = todos[key];
    let obj = { key: key, val: temp};
    todosClone.push(obj);
  });
  return todosClone;
}

reInitializeFormData () {
  this.todo.text = null;
}


}
