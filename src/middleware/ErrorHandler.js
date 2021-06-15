const errorHandler = function (req, res, next) {
  try {
    next();
  } catch (error) {
    console.error(error);

    res.json({ error: "Something went wrong..." });
  }
};

module.exports = errorHandler;
