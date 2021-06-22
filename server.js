const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const errorHandler = require('./src/middleware/ErrorHandler');
const requestLogger = require('./src/middleware/RequestLogger');
const tracker = require('./src/tracker');

app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/users', async (req, res) => {
  const users = await tracker.getUsers();

  res.json(users);
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const user = await tracker.getUserLog(req.params, req.query);

  res.json(user);
});

app.post('/api/users', async (req, res) => {
  const response = await tracker.addUser(req.body);

  res.json(response);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const user = await tracker.addExercise(req.params, req.body);

  res.json(user);
});

const listener = app.listen(3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
