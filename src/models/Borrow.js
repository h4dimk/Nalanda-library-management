import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  borrowedDate: { type: Date, default: Date.now },
  returnedDate: { type: Date },
});

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;
