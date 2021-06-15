const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(console.error);

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  description: String,
  duration: Number,
  date: String,
});

const UserSchema = new Schema({
  username: String,
  log: [LogSchema],
});

const UserModel = mongoose.model("users", UserSchema);

exports.getUsers = async () => {
  return await UserModel.find({}, "username _id");
};

exports.addUser = async (body) => {
  const user = await UserModel.create({
    username: body.username,
    exerciseList: [],
  });

  return {
    _id: user._id,
    username: user.username,
  };
};

exports.addExercise = async (body) => {
  await UserModel.updateOne(
    {
      _id: body.uid,
    },
    {
      $push: {
        log: {
          description: body.description || "",
          duration: parseFloat(body.duration) || 0,
          date: body.date || Date.now().toString(),
        },
      },
    }
  );

  return await UserModel.findById(body.uid);
};

exports.getUserLog = async (params) => {
  return await UserModel.findById(params.uid);
};
