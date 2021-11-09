import express from 'express';
import createError from 'http-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './configs/mongo-connect.js';
import config from './configs/config.js'; 

import usersRouter from './routes/usersRouter.js';
import projectsRouter from './routes/projectsRouter.js';
import jobsRouter from './routes/jobsRouter.js';
import authRouter from './routes/authRouter.js';
import notificationsRouter from './routes/notificationsRouter.js';


const app = express();

/** EXPRESS MIDDLEWARE */
app.use(express.json({ limit: '10MB' }));
app.use(cors({origin: config.frontendOrigin, credentials: true}));
app.use( cookieParser() );


/** ENDPOINTS */
app.get('/', (req, res) => {
    res.send(`<h1>Welcome to Staging Berlin</h1>`);
});


/** ROUTES */
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/jobs', jobsRouter);
app.use('/notifications', notificationsRouter);


/** ANY OTHER ROUTE */
app.use((req, res, next) => {
    const error = new createError(400, `Looks like you are lost...`);
    next(error);
});


const port = config.port;

app.listen(port, () => {
    console.log(`SB listening 🦻 at http://localhost:${port} 💪`);
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