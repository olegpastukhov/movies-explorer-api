const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Invalid password or email');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Invalid password or email');
          }

          return user; // теперь user доступен
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new UnauthorizedError('Invalid password or email');
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new UnauthorizedError('Invalid password or email');
//           }

//           return user; // теперь user доступен
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
