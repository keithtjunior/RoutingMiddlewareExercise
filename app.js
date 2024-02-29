const express = require('express');
const morgan = require("morgan");

const ExpressError = require('./expressError');
const itemsRoutes = require("./itemsRouter");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/items', itemsRoutes);

// default 404 error
app.use((req, res, next) => {
    let err = new ExpressError("Page Not Found", 404)
    next(err);
});

// error handler
app.use(function (err, req, res, next) { 
    // set default vals
    let status = err.status || 500;
    let message = err.msg;
    return res.status(status).json({
      error: { message, status }
    });
});

module.exports = {app, port};