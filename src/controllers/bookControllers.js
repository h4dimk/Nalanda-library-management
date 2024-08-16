import Book from "../models/Book.js";

export const addBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copiesAvailable } =
    req.body;
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

export const updateBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copiesAvailable } =
    req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, ISBN, publicationDate, genre, copiesAvailable },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
