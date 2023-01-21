const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// eslint-disable-next-line consistent-return
const addMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  try {
    // eslint-disable-next-line no-underscore-dangle
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    if (movie) {
      return res.status(201).json(movie);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Invalid req data'));
    }
    return next(e);
  }
};

const getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    if (!movies || movies.length === 0) {
      res.send('Saved movies not found');
    }
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
    const deletedMovie = await Movie.findByIdAndRemove(movieId);
    if (!deletedMovie) {
      return next(new NotFoundError('Movie not found'));
    }
    return res.status(200).send('Deleted');
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
