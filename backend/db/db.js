const mongoose = require("mongoose");
const process = require("process");

const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    const env = process.env.REACT_APP_MONGO_URI;
    console.log(env);
    await mongoose.connect(env);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};
db().catch(console.dir);
module.exports = { db };
