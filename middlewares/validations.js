const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Invalid URL');
      }
      return value;
    }),
    trailerLink: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Invalid URL');
      }
      return value;
    }),
    thumbnail: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Invalid URL');
      }
      return value;
    }),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  signUp,
  signIn,
  userIdValidation,
  updateUserValidation,
  createMovieValidation,
  movieIdValidation,
};
