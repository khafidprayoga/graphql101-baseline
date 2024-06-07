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

export type _getBooksResult = {
  books: Book[];
  count: number;
};
