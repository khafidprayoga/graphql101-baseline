import * as fs from "fs";
import * as path from "path";

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  totalPage: number;
  releaseYear: number;
  isbn: String;
}

type _getBooksPagination = {
  page: number;
  size: number;
};

type _getBooksResult = {
  books: Book[];
  count: number;
};

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

  getBooks(paging: _getBooksPagination): _getBooksResult {
    const { page, size } = paging;
    const start = (page - 1) * size;
    const end = start + size;

    return {
      books: this.books.slice(start, end),
      count: this.books.length,
    };
  }
}
