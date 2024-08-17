import Book from "../models/Book.js";

// Add a new book
export const addBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copiesAvailable } = req.body;
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
    res.status(201).json({ message: "Book added" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing book
export const updateBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copiesAvailable } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, ISBN, publicationDate, genre, copiesAvailable },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a book
export const removeBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all books
export const listBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
