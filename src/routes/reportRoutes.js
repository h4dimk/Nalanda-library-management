import express from "express";
import {
  activeMembers,
  availableBooks,
  mostBorrowedBooks,
} from "../controllers/reportControllers.js";

const router = express.Router();

// Most Borrowed Books
router.get("/most-borrowed", mostBorrowedBooks);

// Active Members
router.get("/active-members", activeMembers);

// Book Availability
router.get("/book-availability", availableBooks);

export default router;
