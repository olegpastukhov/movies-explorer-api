require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Invalid email or password'));
  }
  try {
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      next(new ConflictError(`User with ${email} already exists`));
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      password: hash,
    });
    return res.status(201).json({
      name: user.name,
      _id: user._id,
      email: user.email,
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError('Invalid user data'));
    }
    return next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Invalid email or password'));
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 6.048e+8,
        sameSite: 'none',
        secure: true,
      });
      res.send({ message: 'Token was saved in the cookies' });
    }
    return res.status(201).send('Authorized');
  } catch (e) {
    return next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      return next(new NotFoundError('User not found'));
    }
    return res.status(200).send({
      name: currentUser.name,
      email: currentUser.email,
    });
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      next(new ConflictError(`User with ${email} already exists`));
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.status(200).send({
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    return next(e);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Token was deleted from cookies' });
  // return res.cookie('jwt', { expires: Date.now() }).send({ message: 'Token was deleted' });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
  logout,
};
