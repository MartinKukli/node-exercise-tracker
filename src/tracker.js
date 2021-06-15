const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
    username: user.username,
    _id: user._id,
  };
};

exports.addExercise = async (params, body) => {
  const getDate = () => {
    const date = !!body.date ? new Date(body.date) : new Date();

    return date.toDateString();
  };

  const log = {
    description: body.description,
    duration: parseFloat(body.duration),
    date: getDate(),
  };

  const user = await UserModel.findByIdAndUpdate(params._id, {
    $push: {
      log,
    },
  });

  return {
    _id: user._id,
    username: user.username,
    ...log,
  };
};

exports.getUserLog = async (params, query) => {
  const getQuery = () => {
    const mongoQuery = { _id: params._id };

    if (mongoQuery.from) {
      mongoQuery.log.$gte = new Date(query.from).toDateString();
    }

    if (mongoQuery.to) {
      mongoQuery.log.$lte = new Date(query.to).toDateString();
    }

    return mongoQuery;
  };

  const user = await UserModel.findOne(getQuery());

  return {
    _id: user._id,
    username: user.username,
    count: user.log.length,
    log: !!query.limit ? user.log.slice(0, query.limit) : user.log,
  };
};
