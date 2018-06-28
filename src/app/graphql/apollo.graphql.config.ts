import { setContext } from 'apollo-link-context';
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

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