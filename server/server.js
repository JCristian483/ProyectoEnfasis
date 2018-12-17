'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');

let index = require('./routes/index-route');
let users = require('./routes/users-route');
let missingdocs = require('./routes/missingdocs-route');

mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/MissingDocsPOLI')
    .then(() => {
        console.log('Conectado a MongoDB!!!');
    })
    .catch((err) => {
        console.err('Error de conexión con MongoDB: ' + err);
    });

let app = express();

//app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', index);
app.use('/api/users', users);
app.use('/api/missingdocs', missingdocs);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3003);

module.exports = app;