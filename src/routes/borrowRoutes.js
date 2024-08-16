import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  borrowBook,
  borrowHistory,
  returnBook,
} from "../controllers/borrowController.js";

const router = express.Router();

// Borrow Book
router.post("/", authenticate(["Member"]), borrowBook);

// Return Book
router.post("/return", authenticate(["Member"]), returnBook);

// Borrow History
router.get("/history", authenticate(["Member"]), borrowHistory);

export default router;
