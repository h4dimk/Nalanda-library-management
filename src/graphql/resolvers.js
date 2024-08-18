import Book from "../models/Book.js";
import User from "../models/User.js";
import Borrow from "../models/Borrow.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  // Query resolvers
  Query: {
    getBooks: async () => await Book.find(),

    getBook: async (_, { id }) => await Book.findById(id),

    getUsers: async (_, __, { req }) => {
      if (!req.user || req.user.role !== "Admin") {
        throw new Error("Unauthorized");
      }
      return await User.find();
    },

    getUser: async (_, { id }, { req }) => {
      if (!req.user) {
        throw new Error("Unauthorized");
      }
      const user = await User.findById(id).populate("borrowedBooks");
      return user;
    },

    borrowHistory: async (_, __, { req }) => {
      if (!req.user) {
        throw new Error("Unauthorized");
      }
      const userId = req.user.id;
      return await Borrow.find({ userId }).populate("bookId");
    },

    mostBorrowedBooks: async () => {
      const mostBorrowed = await Borrow.aggregate([
        { $group: { _id: "$bookId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
      ]);
      return mostBorrowed.map((borrow) => borrow.book);
    },
  },

  // Mutation resolvers
  Mutation: {
    addBook: async (
      _,
      { title, author, ISBN, publicationDate, genre, copiesAvailable },
      { req }
    ) => {
      // Check for Admin role
      if (!req.user || req.user.role !== "Admin") {
        throw new Error("Unauthorized");
      }
      try {
        const book = new Book({
          title,
          author,
          ISBN,
          publicationDate,
          genre,
          copiesAvailable,
        });
        await book.save();
        return book;
      } catch (error) {
        throw new Error(`Error adding book: ${error.message}`);
      }
    },

    updateBook: async (
      _,
      { id, title, author, ISBN, publicationDate, genre, copiesAvailable },
      { req }
    ) => {
      // Check for Admin role
      if (!req.user || req.user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      const book = await Book.findByIdAndUpdate(
        id,
        { title, author, ISBN, publicationDate, genre, copiesAvailable },
        { new: true }
      );
      return book;
    },

    removeBook: async (_, { id }, { req }) => {
      // Check for Admin role
      if (!req.user || req.user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      await Book.findByIdAndDelete(id);
      return "Book deleted";
    },

    borrowBook: async (_, { bookId }, { req }) => {
      if (!req.user) {
        throw new Error("Unauthorized");
      }

      const userId = req.user.id;
      const book = await Book.findById(bookId);

      if (!book) {
        throw new Error("Book not found");
      }
      if (book.copiesAvailable <= 0) {
        throw new Error("No copies available");
      }
      const user = await User.findById(userId);
      const borrow = new Borrow({ bookId, userId });
      book.copiesAvailable -= 1;
      await book.save();
      user.borrowedBooks.push(bookId);
      await user.save();

      await borrow.save();

      return "Book borrowed";
    },

    returnBook: async (_, { borrowId }, { req }) => {
      if (!req.user) {
        throw new Error("Unauthorized");
      }

      const borrow = await Borrow.findById(borrowId);
      if (!borrow) {
        throw new Error("Borrow record not found");
      }
      const book = await Book.findById(borrow.bookId);
      if (!book) {
        throw new Error("Book not found");
      }
      borrow.returnedDate = new Date();
      await borrow.save();
      book.copiesAvailable += 1;
      await book.save();
      return "Book returned";
    },

    signup: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      return user;
    },

    signin: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return { token, user };
    },
  },
};
