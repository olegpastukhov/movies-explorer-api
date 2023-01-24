const router = require('express').Router();
const { NotFoundError } = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');

const {
  signUp,
  signIn,
} = require('../middlewares/validations');

const auth = require('../middlewares/auth');

router.post('/signup', signUp, createUser);
router.post('/signin', signIn, login);

router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./movies'));

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Server will fall soon');
//   }, 0);
// });

router.post('/signout', logout);

router.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

module.exports = router;
