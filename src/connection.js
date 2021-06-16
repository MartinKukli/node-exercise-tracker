const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch(console.error);

const LogSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  log: [LogSchema],
});

module.exports = mongoose.model("users", UserSchema);
