const express = require('express');
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const { PORT } = require('./config');
const { requestLogger } = require('./middleware/logger');
const app = express();

app.use(requestLogger);
app.use(express.static('public'));

app.get('/api/notes', function(req, res) {
    //same as const searchTerm =  req.query.searchTerm;
    const {searchTerm} = req.query;

    notes.filter(searchTerm, (err, list, next) => {
        if (err) {
            return next(err);
        }
        res.json(list);
    });
});

app.get('/api/notes/:id', function(req, res, next) {
    //Same as const id = req.params.id;
    const {id} = req.params;
    
    notes.find(id, (err, item) => {
        if (err) {
            next(err);
        } else if (item) {
            res.json(item);
        } else {
            next();
        }
    });
});

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ message: 'Not found' });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
    console.log(err);
});
