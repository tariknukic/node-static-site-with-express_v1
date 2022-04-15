const express = require('express');
const { projects } = require('./data.json');

/* Instantiate Express app */
const app = express();

/* Setup view engine */
app.set('view engine', 'pug');

/* Static middleware for serving static files*/
app.use('/static', express.static('public'));

/* CREATING ROUTES */

app.get('/', (req, res) => {
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res, next) => {
    const { id } = req.params;

    if (projects[id]) {
        res.render('project', { projects, id });
    } else {
        const err = new Error(); 
        err.status = 404;
        err.message = 'Looks like the project you requested doesn\'t exist';
        console.log(err.status, err.message);
        next(err);
    }
});

/* ERROR HANDLERS */

/* 404 handler to catch undefined or non-existent route requests */
app.use((req, res, next) => {
    const err = new Error(); 
    err.status = 404;
    err.message = 'Page not found. Looks like that this route does not exist.';
    console.log(err.status, err.message);
    res.status(404).render('page-not-found');
});

// global error handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('page-not-found', { err });
    } else {
        err.message = err.message || `Oops!  It looks like something went wrong on the server.`;
        err.status = err.status || 500;
        console.log(err.status, err.message);
        res.status(err.status || 500).render('error', { err });
    }
});

app.listen(3000, () => {
    console.log('The application is running on local host:3000!');
});



