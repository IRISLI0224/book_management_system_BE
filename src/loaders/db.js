const mongoose = require('mongoose');
const LINK='mongodb+srv://node:NgwVBhIFpZBRu28t@cluster0.bxc2i.mongodb.net/Sample_BE?authSource=admin&replicaSet=atlas-sgghan-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';
exports.connectToDB = () => {
  const { DB_LINK } = process.env;
  const connectionString = `${LINK}`;
  return mongoose.connect(connectionString);
};