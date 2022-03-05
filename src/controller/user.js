const User = require("../model/user");
const Book = require("../model/book");


// display all users
exports.index = async (req, res) => {
  const users = await User.find().exec();
  res.status(200).json(users);
};

// create a new and return the created object
exports.store = async (req, res) => {
  const { email, name, phone, date_of_birth } = req.body;

  //check if the email exists in the system
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(403).send("Email already exists");

  //check if the name exists in the system
  const existingName = await User.findOne({ name });
  if (existingName) return res.status(403).send("Name already exists");

  const user = new User({
    email,
    name,
    phone,
    date_of_birth,
  });

  try {
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(404).json(error);
  }
};

// update one user by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { email, phone, name, date_of_birth } = req.body;

  //check if the name exists in the system
  const existingName = await User.findOne({ name });

  if (existingName)
    if (existingName._id.toString() !== id)
      return res.status(403).send("Name already exists");

  //user can't change email

  const user = await User.findByIdAndUpdate(
    id,
    { phone, name, date_of_birth },
    { new: true }
  ).exec();

  if (!user) res.status(404).send("user not found");
  res.status(200).json(user);
};

// get one user by ID
exports.show = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("books").exec();

  if (!user) res.status(404).send("user not found");
  res.status(200).json(user);
};

// delete one user by ID
exports.destroy = async (req, res) => {
  const { id } = req.params;
  //Set all books borrowed by the user to be not borrowed
  const user = await User.findById(id).populate("books");
  //user id is still there but it's ok, since the book borrowed status is false
  if (user) {
    (user?.books).map(async (id) => {
      const eachBook = await Book.findByIdAndUpdate(
        id,
        {
          borrowed: false
        },
        { new: true }
      ).exec();
    });
  }

  await User.findByIdAndDelete(id).exec();
  if (!user) res.status(404).send("user not found");
  res.status(200).json("user deleted");
};
