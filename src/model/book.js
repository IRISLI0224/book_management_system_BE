const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  borrowed: {
    type: Boolean,
    required: true,
  },
});

//bookSchema.index({ address: 1 }, { unique: true });
const book = mongoose.model("Book", bookSchema);

module.exports = book;
