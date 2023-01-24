const router = require('express').Router();
const {
  updateUserValidation,
} = require('../middlewares/validations');

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUserValidation, updateUser);

module.exports = router;
