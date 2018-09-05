const express = require('express');
const data = require('./db/notes');
const app = express();

app.use(express.static('public'));

app.get('/api/notes', function(req, res) {
	res.json(data);
});

app.get('/api/notes/:id', function(req, res) {
	const {id} = req.params;
//	const id = req.params.id; LINE 12 EQUALS TO THIS

	let requestedData = data.find(x => x.id === Number(id));

	res.json(requestedData);
});

app.listen(8080, function() {
	console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
	console.log(err);
});