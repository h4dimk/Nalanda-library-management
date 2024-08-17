import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

// Get the most borrowed books
export const mostBorrowedBooks = async (req, res) => {
  try {
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
    res.json(mostBorrowed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the most active members
export const activeMembers = async (req, res) => {
  try {
    const activeMembers = await Borrow.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    res.json(activeMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get available books with their count
export const availableBooks = async (req, res) => {
  try {
    const availability = await Book.find({}, "title copiesAvailable");
    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
