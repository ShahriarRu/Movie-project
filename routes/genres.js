const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  //res.send(genres);
  res.json("Welcome to movie genres.   Go to https://genre-project.herokuapp.com/api/genres to get all genrelist.    You can get genres by using specific id.   This app is ready for crud operation");
  
});

router.get('/genres', async (req, res) => {
  const genres = await Genre.find().sort('name');
  //res.send(genres);
  res.json(genres);
  
});

router.post('/genres', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

router.put('/genres:id', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/genres:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/genres:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;