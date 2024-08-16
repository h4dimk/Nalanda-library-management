import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";

export const borrowBook = async (req, res) => {
  const { bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (book.copiesAvailable <= 0) {
      return res.status(400).json({ error: "No copies available" });
    }
    const user = await User.findById(req.user.id);
    const borrow = new Borrow({ bookId, userId: user._id });
    await borrow.save();
    book.copiesAvailable -= 1;
    await book.save();
    user.borrowedBooks.push(bookId);
    await user.save();
    res.json({ message: "Book borrowed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const returnBook = async (req, res) => {
  const { borrowId } = req.body;
  try {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow || borrow.returnedDate) {
      return res.status(400).json({ error: "Invalid borrow record" });
    }
    const book = await Book.findById(borrow.bookId);
    const user = await User.findById(borrow.userId);
    borrow.returnedDate = new Date();
    await borrow.save();
    book.copiesAvailable += 1;
    await book.save();
    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b.toString() !== book._id.toString()
    );
    await user.save();
    res.json({ message: "Book returned" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const borrowHistory = async (req, res) => {
  try {
    const borrows = await Borrow.find({ userId: req.user.id }).populate(
      "bookId"
    );
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
