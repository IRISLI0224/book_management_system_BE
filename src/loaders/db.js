const mongoose = require('mongoose');

exports.connectToDB = () => {
  const { DB_LINK } = process.env;
  const connectionString = `${DB_LINK}`;
  return mongoose.connect(connectionString);
};