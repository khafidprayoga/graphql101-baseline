import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFiles } from "@graphql-tools/load-files";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";

const Book = {
  id: +new Date(),
  title: "Harry Potter and the Chamber of Secrets",
  description:
    "Harry Potter and the Chamber of Secrets is a fantasy novel written by British author J.K. Rowling and the second novel in the Harry Potter series.",
  author: "J.K. Rowling",
  totalPage: 251,
  releaseYear: 1998,
  isbn: "0439064864",
};

async function bootstrap() {
  const schema = await loadFiles("src/**/*.graphql");
  const mocks = {
    Int: () => Math.floor(Math.random() * 100),
    Book: () => Book,
  };

  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({
        typeDefs: schema,
      }),
      mocks,
    }),
  });

  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
