import * as fs from "fs";
import * as path from "path";
import { Author, Book, getBooksPagination, _getBooksResult } from "./types";

export class AuthorDataSource {
  private authors: Author[] = [];
  constructor() {
    const location = path.join(__dirname, "authors.json");
    const data = fs.readFileSync(location, "utf-8");
    this.authors = JSON.parse(data);
    console.log("seed authors data succeed");
  }

  async getAuthor(authorId: string): Promise<Author | null> {
    const author =
      this.authors.find((author) => author.id === authorId) || null;
    if (author !== null) {
      console.log("get author by id", authorId, author);
    }

    // blocking: simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return author;
  }

  getAuthors(): Author[] {
    return this.authors;
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
