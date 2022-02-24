import { ReactNode } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloProvider
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  ErrorResponse,
  onError as onApiError
} from '@apollo/client/link/error';

import config from '@usm/config';

export type IErrorResponse = ErrorResponse;

export interface IApolloClientProviderProps {
  onError: (e: ErrorResponse) => void;
  children: ReactNode;
}

export type ICreateApolloClientProps = Omit<
  IApolloClientProviderProps,
  'children'
>;

export function createApolloClient({ onError }: ICreateApolloClientProps) {
  const httpLink = createHttpLink({
    uri: config.solanaFMUri
  });

  const errorLink = onApiError(onError);

  const authLink = setContext(
    async (request, context): Promise<unknown | undefined> => {
      return {
        headers: {
          apikey: config.solanaFMApiKey
        }
      };
    }
  );

  return new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache()
  });
}

export function ApolloClientProvider({
  onError,
  children
}: IApolloClientProviderProps) {
  return (
    <ApolloProvider client={createApolloClient({ onError })}>
      {children}
    </ApolloProvider>
  );
}
