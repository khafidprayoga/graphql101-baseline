import * as fs from "fs";
import * as path from "path";

export interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author: Author;
  totalPage: number;
  releaseYear: number;
  isbn: String;
}

export interface Author {
  id: string;
  fullName: string;
}

export type getBooksPagination = {
  page: number;
  size: number;
  authorId?: string;
};

type _getBooksResult = {
  books: Book[];
  count: number;
};

export class AuthorDataSource {
  private authors: Author[] = [];
  constructor() {
    const location = path.join(__dirname, "authors.json");
    const data = fs.readFileSync(location, "utf-8");
    this.authors = JSON.parse(data);
    console.log("seed authors data succeed");
  }

  getAuthor(authorId: string): Author | null {
    const author =
      this.authors.find((author) => author.id === authorId) || null;
    if (author !== null) {
      console.log("get author by id", authorId, author);
    }

    return author;
  }
}

export class StoreDataSource {
  private books: Book[] = [];
  constructor() {
    const location = path.join(__dirname, "books.json");
    const data = fs.readFileSync(location, "utf-8");
    this.books = JSON.parse(data);
    console.log("seed books data succeed");
  }

  addBook(book: Book): Book {
    this.books.push(book);
    return book;
  }

  deleteBook(bookId: string): boolean {
    const bookIndex = this.books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      return false;
    }
    this.books.splice(bookIndex, 1);
    return true;
  }

  getBook(bookId: any): Book | null {
    return this.books.find((book) => book.id === bookId) || null;
  }

  getBooks(paging: getBooksPagination): _getBooksResult {
    const { page, size } = paging;
    const start = (page - 1) * size;
    const end = start + size;

    if (paging.authorId) {
      switch (true) {
        case paging.authorId === "unknown":
          const noAuthorBooks = this.books
            .filter((book) => book.authorId === "")
            .slice(start, end);
          return {
            books: noAuthorBooks,
            count: noAuthorBooks.length,
          };

        default:
          const authorBookFiltered = this.books
            .filter((book) => book.authorId === paging.authorId)
            .slice(start, end);
          return {
            books: authorBookFiltered,
            count: authorBookFiltered.length,
          };
      }
    }

    return {
      books: this.books.slice(start, end),
      count: this.books.length,
    };
  }
}
