import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    borrowedBooks: [Book]
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copiesAvailable: Int!
  }

  type Borrow {
    id: ID!
    book: Book!
    user: User!
    borrowedDate: String!
    returnedDate: String
  }

  type Query {
    getBooks: [Book]
    getBook(id: ID!): Book
    getUsers: [User]
    getUser(id: ID!): User
    borrowHistory: [Borrow]
    mostBorrowedBooks: [Book]
  }

  type AuthPayload {
    token: String!
    user: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      ISBN: String!
      publicationDate: String!
      genre: String!
      copiesAvailable: Int!
    ): Book

    updateBook(
      id: ID!
      title: String!
      author: String!
      ISBN: String!
      publicationDate: String!
      genre: String!
      copiesAvailable: Int!
    ): Book

    removeBook(id: ID!): String

    borrowBook(bookId: ID!): Borrow
    returnBook(borrowId: ID!): Borrow

    signup(name: String!, email: String!, password: String!): User
    signin(email: String!, password: String!): AuthPayload
  }
`;
