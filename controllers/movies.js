const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const addMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    if (movie) {
      return res.status(201).json(movie);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Invalid req data'));
    }
    return next(e);
  }
  return null;
};

const getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    if (movies.length === 0) {
      // res.json('Saved movies not found');
      return res.status(200).send([]);
    }
    // return res.status(200).send(movies);
    return res.status(200).json(movies);
  } catch (e) {
    return next(e);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }
    const movieOwnerId = movie.owner.valueOf();
    if (movieOwnerId !== userId) {
      throw new ForbiddenError('Forbidden');
    }
    await Movie.findByIdAndRemove(movieId);
    return res.status(200).json(`The movie with id ${movieId} has been deleted`);
    // return res.status(200);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
