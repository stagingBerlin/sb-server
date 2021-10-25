import express from 'express';
const app = express();

import './configs/config.js';

import createError from 'http-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './configs/mongo-connect.js'



/** EXPRESS MIDDLEWARE */
app.use(express.json({ limit: '10MB' }));
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use( cookieParser() );


/** ENDPOINTS */
app.get('/', (req, res) => {
    res.send(`<h1>Staging Berlin</h1>`);
});


/** ROUTES */



/** ANY OTHER ROUTE */
app.use((req, res, next) => {
    const error = new createError(400, `Looks like you are lost...`);
    next(error);
});


const port = 5000

app.listen(port, () => {
    console.log(`App listening 🦻 at http://localhost:${port}`);
});

/** ERROR HANDLING */
app.use(function errorHandler(err, req, res, next) {
    // console.log('I am the old handler: =>', err.message);
      res.status(err.status || 400).send({
        error: {
          message: err.message || null,
          status: err.status || null,
        },
    });
});