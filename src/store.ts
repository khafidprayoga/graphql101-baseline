import { faker } from "@faker-js/faker";

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
    for (let i = 0; i < 10; i++) {
      this.books.push({
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(1),
        author: faker.person.fullName(),
        totalPage: faker.number.int({ min: 100, max: 500 }),
        releaseYear: faker.date
          .past({
            years: 10,
          })
          .getFullYear(),
        isbn: faker.string.numeric(10),
      });
    }

    let debug = JSON.stringify(this.books, null, 2);
    console.log(debug);
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
