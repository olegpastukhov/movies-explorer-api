const router = require('express').Router();
const {
  createMovieValidation,
  movieIdValidation,
} = require('../middlewares/validations');
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', createMovieValidation, addMovie);

router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
