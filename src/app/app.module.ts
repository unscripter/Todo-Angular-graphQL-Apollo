import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { setContext } from 'apollo-link-context';
import { createPersistedQueryLink } from "apollo-link-persisted-queries";


export function createApollo(httpLink: HttpLink) {
  const auth = setContext((_, { headers }) => {
    // get the authentication token from local storage/cookies if it exists
    const token = localStorage.getItem('token');
    if (!token) {
      return {};
    } else {
      return {
        headers: headers.append('access-token', `Bearer ${token}`)
      };
    }
  });
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  };

  return {
    link: createPersistedQueryLink({useGETForHashedQueries: true}).concat(httpLink.create({uri: 'http://localhost:4005/graphql?'})),
    cache: new InMemoryCache(),
    dataIdFromObject: object => object.id,
    cachePolicy: { query: true, data: false },
    defaultOptions: defaultOptions,
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
    FormsModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
