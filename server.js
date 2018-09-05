const express = require('express');
const data = require('./db/notes');
const { PORT } = require('./config');
const { requestLogger } = require('./middleware/logger');
const app = express();

app.use(requestLogger);
app.use(express.static('public'));

app.get('/api/notes', function(req, res) {
    //same as const searchTerm =  req.query.searchTerm;
    const {searchTerm} = req.query;
    //Same as if (Searchterm === true) {return data.filter(...) else {return data}}
    res.json(searchTerm ? data.filter(string => string.title.includes(searchTerm)) : data);
});

app.get('/api/notes/:id', function(req, res) {
    //Same as const id = req.params.id;
    const {id} = req.params;
    let requestedData = data.find(x => x.id === Number(id));
    res.json(requestedData);
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
