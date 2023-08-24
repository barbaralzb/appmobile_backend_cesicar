const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const dbConfig = require('./dbConfig')

const usersRouter = require('./routes/users')
// const travelsRouter = require('./routes/travels')


const middlewares = require('./src/middlewares');
const api = require('./src/api');


const app = express();



app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(express.json());


app.use('/users', usersRouter)
// app.use('/travels', travelsRouter)

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke !')
})

module.exports = app;

function suma(a, b) {
  return a + b;
}

module.exports = { suma };