const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
const usersRouter = require('./users');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Use session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.use('/', usersRouter);

// Error handling middleware (place it after your routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
