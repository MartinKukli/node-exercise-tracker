const requestLogger = function (req, res, next) {
  console.group("Request:");

  console.log(`Method: ${req.method}, path: ${req.path}`);

  console.log(`Body:`, req.body);

  console.groupEnd();

  next();
};

module.exports = requestLogger;
