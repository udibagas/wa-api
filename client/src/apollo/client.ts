import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  credentials: "include", // biar bisa baca token dari session
  cache: new InMemoryCache(),
});

export default apolloClient;
