const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory user and playlist data (for simplicity)
const users = [];
const playlists = {};

// Home Page with Movie Search
router.get('/', (req, res) => {
  res.render('home', { user: req.session.user, movies: [] }); // Pass an empty array initially
});

router.post('/search', async (req, res) => {
  const { searchQuery } = req.body;
  try {
    // Make a request to OMDB API with the provided API key
    const response = await axios.get(`http://www.omdbapi.com/?s=${searchQuery}&apikey=e714d0c9`);
    const movies = response.data.Search || [];
    res.render('home', { user: req.session.user, movies });
  } catch (error) {
    console.error(error);
    res.render('home', { user: req.session.user, error: 'Error searching for movies', movies: [] }); // Pass an empty array here as well
  }
});

// Movie Details Page (no login required)
router.get('/movie/:imdbID', async (req, res) => {
  const imdbID = req.params.imdbID;
  try {
    // Make a request to OMDB API for movie details with the provided API key
    const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=e714d0c9`);
    const movie = response.data;
    res.render('movie', { user: req.session.user, movie });
  } catch (error) {
    console.error(error);
    res.render('movie', { user: req.session.user, error: 'Error fetching movie details' });
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // Your login logic here
  // ...
});

// Create Playlist Page
router.get('/create-playlist', (req, res) => {
  if (req.session.user) {
    res.render('create-playlist', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

router.post('/create-playlist', (req, res) => {
  // Handle playlist creation logic here
  // You can create a new playlist and save it to your in-memory data structure
  const { playlistName } = req.body;
  const user = req.session.user;

  if (!user) {
    // Redirect to login if user is not logged in
    return res.redirect('/login');
  }

  // Create a new playlist object and add it to the user's playlists
  const newPlaylist = {
    name: playlistName,
    movies: [], // You can initialize the playlist with an empty array of movies
  };

  if (!user.playlists) {
    user.playlists = []; // Initialize the playlists array if it doesn't exist
  }

  user.playlists.push(newPlaylist);

  // Redirect to the user's playlist page or any other appropriate page
  res.redirect('/playlist');
});

// Registration Page
router.get('/register', (req, res) => {
  res.render('register'); // Assuming you have a register.ejs file for the registration page
});

// Handle registration form submission
router.post('/register', (req, res) => {
  // Extract user registration data from the request body
  const { username, password } = req.body;

  // Implement your user registration logic here, such as creating a new user in your database
  // For simplicity, you can add the user to the "users" array in memory
  const newUser = { username, password };
  users.push(newUser);

  // Redirect the user to the login page after successful registration
  res.redirect('/login');
});


module.exports = router;
