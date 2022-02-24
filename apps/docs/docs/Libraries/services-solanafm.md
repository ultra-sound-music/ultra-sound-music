# Services: SolanaFM

An Apollo-GraphQL client library that consumes data from the [SolanaFM](https://solana.fm/) service.

### Example

From within your React Component:

```
import { useGetBlocks } from '@usm/services-solanafm'
...
function MyComponent() {
  const { data, loading, error } = useGetBlocks();
  ...
}
```

### Write your own Queries

1. Add your new query to `solanafm/src/queries.ts`;
2. Add a hook that consumes your new query to `solanafm/src/hooksts.ts`
