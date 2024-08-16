import express from "express";
import authenticate from "../middlewares/authenticate.js"; // Middleware for authentication
import {
  addBook,
  listBooks,
  removeBook,
  updateBook,
} from "../controllers/bookControllers.js";

const router = express.Router();

router.post("/add", authenticate(["Admin"]), addBook);
router.put("/update/:id", authenticate(["Admin"]), updateBook);
router.delete("/remove/:id", authenticate(["Admin"]), removeBook);

// List Books (All Users)
router.get("/", listBooks);

export default router;
