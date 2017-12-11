const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const routes = require('./routes/v1');
const cors = require('cors');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');

const { port, env } = require('./config/vars');

const app = express();

if (env !== 'development') {
  const logDirectory = path.join(__dirname, 'log');

  // setup request logging foplder
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream
  const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory,
  });
    // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// Configure CORS headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// mount api v1 routes
app.use('/v1', routes);

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

module.exports = app;
