import logger from '@usm/util-logger';
import { ApolloClientProvider, IErrorResponse } from '@usm/services-solanafm';

export interface ISolanaFMProviderProps {
  children: React.ReactNode;
}

function onError({ response, graphQLErrors, networkError }: IErrorResponse) {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      logger.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);
  }
}

export function SolanaFMProvider({ children }: ISolanaFMProviderProps) {
  return <ApolloClientProvider onError={onError}>{children}</ApolloClientProvider>;
}

export default SolanaFMProvider;
