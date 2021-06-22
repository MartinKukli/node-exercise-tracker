const UserModel = require('./connection');

exports.getUsers = async () => {
  return await UserModel.find({}, 'username _id');
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
  const user = await UserModel.findOne(createQuery(params, query));

  const log = user.log.slice(0, query.limit) || user.log;

  return {
    _id: user._id,
    username: user.username,
    count: user.log.length,
    log,
  };
};

function createQuery(params, query) {
  const mongoQuery = { _id: params._id };

  if (mongoQuery.from) {
    mongoQuery.log.$gte = new Date(query.from).toDateString();
  }

  if (mongoQuery.to) {
    mongoQuery.log.$lte = new Date(query.to).toDateString();
  }

  return mongoQuery;
}
