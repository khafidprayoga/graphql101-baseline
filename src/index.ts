import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { StoreDataSource, AuthorDataSource } from "./store";
import { getBooksPagination } from "./types";
import * as DataLoader from "dataloader";

const store = new StoreDataSource();
const authorStore = new AuthorDataSource();

const resolvers = {
  Query: {
    book(parent, { id }, ctx, info) {
      const book = store.getBook(id);
      return book;
    },

    books(parent, { page, size, authorId }, ctx, info) {
      const req: getBooksPagination = {
        page: page || 1,
        size: size || 10,
        authorId: authorId || null,
      };
      const bookList = store.getBooks(req);
      return bookList;
    },
  },
  Book: {
    author(parent, args, ctx, info) {
      return ctx.authorLoader.load(parent.authorId);
      // return authorStore.getAuthor(parent.authorId);
    },
  },
};

async function bootstrap() {
  const schema = await loadFiles("src/**/*.graphql");

  const server = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: schema,
      resolvers: resolvers,
    }),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => ({
      authorLoader: new DataLoader(async (keys) => {
        const authorList = authorStore.getAuthors();
        const authorKV = new Map();

        authorList.forEach((author) => {
          authorKV.set(author.id, author);
        });

        return keys.map((key) => {
          authorKV.get(key) || null;
        });
      }),
    }),
  });
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
