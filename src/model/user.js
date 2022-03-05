const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  date_of_birth:{
    type: Date,
    required: false,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;