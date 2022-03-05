const Book = require("../model/book");
const User = require("../model/user");

// create a book and return the created object
exports.store = async (req, res) => {
  const { name, author, categories } = req.body;

  //check if the book exists in the system
  const existingBook = await Book.findOne({ name, author });
  if (existingBook) return res.status(403).send("Book already exists");

  const book = new Book({
    name,
    author,
    categories,
    borrowed: false,
  });

  try {
    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    return res.status(404).json(error);
  }
};

// update a book by id
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, author, categories, borrowed } = req.body;

  //check if the book exists in the system
  const existingBook = await Book.findOne({ name, author });
  if (existingBook)
    if (existingBook._id.toString() !== id)
      return res.status(403).send("Book already exists");

  const newBook = await Book.findByIdAndUpdate(
    id,
    {
      name,
      author,
      categories,
      borrowed,
    },
    { new: true } //return the updated book
  ).exec();

  if (!newBook) res.status(404).json({ error: "Book not found" });
  return res.status(200).json(newBook);
};

// user:ID borrow book:ID 
exports.borrow = async (req, res) => {
  const { userid, bookid } = req.params;
  //check if book is borrowed
  const checkBook = await Book.findById(bookid);
  if (!checkBook) return res.status(404).json({ error: "can't find the book" });
  if (checkBook?.borrowed) return res.status(404).json({ error: "book is already borrowed" });

  //add the book to user
  try {
    const user = await User.findById(userid);
    user.books.push(bookid);
    await user.save();
    //res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ error: "cannot find user" });
  }

  //add the user to book
  try {
    const book = await Book.findById(bookid);
    book.user=userid;
    await book.save();
   // res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ error: "cannot find book" });
  }

  const id=bookid;
  const newBook = await Book.findByIdAndUpdate(
    id,
    {
      borrowed:true
    },
    { new: true } //return the updated book
  ).exec();

  return res.status(200).json(`User ${userid} borrowed book ${bookid}`);
};

// delete a book by id
exports.destroy = async (req, res) => {
  const { id } = req.params;
  const checkBook = await Book.findById(id).exec();
  if (!checkBook) res.status(404).json({ error: "Book not found" });
  //remove the book from user if the book is borrowed by a user
  if (checkBook.borrowed) {
    try {
      const user = await User.findById(checkBook.user);
      user.books.pull(checkBook._id);
      await user.save();
      //res.sendStatus(204);
    } catch (error) {
      return res.status(404).json({ error: "cannot find user" });
    }
  }

  const book = await Book.findByIdAndDelete(id).exec();

  res.status(200).json("book deleted");
};

// display a book by id
exports.show = async (req, res) => {
  // eslint-disable-next-line implicit-arrow-linebreak
  const { id } = req.params;
  const book = await Book.findById(id).populate("user").exec();

  if (!book) return res.status(404).json({ error: "book not found" });
  return res.status(200).json(book);
};
