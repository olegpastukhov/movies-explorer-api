require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT,
  NODE_ENV,
  MONGO_URL,
  MONGO_URL_DEV,
} = require('./utils/constants');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(requestLogger); // подключаем логгер запросов
app.use(cookieParser());
app.use(helmet());

app.use(limiter);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening to port: ${PORT}!`);
  });
});
