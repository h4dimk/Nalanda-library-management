import express from "express";
import authenticate from "../middlewares/authenticate.js"; 
import {
  addBook,
  listBooks,
  removeBook,
  updateBook,
} from "../controllers/bookControllers.js";

const router = express.Router();

// Route to add a new book
router.post("/add", authenticate(["Admin"]), addBook);

// Route to update a book by ID
router.put("/update/:id", authenticate(["Admin"]), updateBook);

// Route to remove a book by ID
router.delete("/remove/:id", authenticate(["Admin"]), removeBook);

// Route to list all books, accessible by all users
router.get("/", listBooks);

export default router;
