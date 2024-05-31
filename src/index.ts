import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFiles } from "@graphql-tools/load-files";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function bootstrap() {
  const schema = await loadFiles("src/**/*.graphql");
  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({
        typeDefs: schema,
      }),
    }),
  });

  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
