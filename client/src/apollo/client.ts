import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || "/graphql",
  credentials: "include", // biar bisa baca token dari session
  cache: new InMemoryCache(),
});

export default apolloClient;
