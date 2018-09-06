const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', function(req, res) {
    //same as const searchTerm =  req.query.searchTerm;
    const {searchTerm} = req.query;

    notes.filter(searchTerm, (err, list, next) => {
        if (err) {
            return next(err);
        }
        res.json(list);
    });
});

router.get('/:id', function(req, res, next) {
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

router.post('/', (req, res, next) => {
    const { title, content } = req.body;

    const newNote = { title, content };

    if(!newNote.title) {
        const err = new Error('There must be a title in the body');
        err.status = 400;
        next(err);
    }

    notes.create(newNote, (err, note) => {
        if(err) {
            next(err);
        } else if (note) {
            res.location(`https://${req.headers.host}/${note.id}`).status(200).json(note);
        } else {
            next();
        }
    });
});

router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    
    const updateObj = {};
    const updateFields = ['title', 'content'];

    updateFields.forEach(field => {
        if (field in req.body) {
            updateObj[field] = req.body[field];
        }
    });

    notes.update(id, updateObj, (err, item) => {
        if(err) {
            next(err);
        } else if (item) {
            res.json(item);
        } else {
            next();
        }
    });
});

module.exports = router;