import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { StoreDataSource } from "./store";

const store = new StoreDataSource();
const resolvers = {
  Query: {
    book(parent, { id }, ctx, info) {
      return store.getBook(id);
    },
  },
};

async function bootstrap() {
  const schema = await loadFiles("src/**/*.graphql");

  const server = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: schema,
      resolvers,
    }),
  });

  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
