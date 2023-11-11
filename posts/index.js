const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4000;
const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts/create', async (req, res) => {
	const id = randomBytes(5).toString('hex');
	const { title } = req.body;
	posts[id] = {
		id,
		title,
	};

	await axios.post('http://event-bus-svc:4005/events', {
		type: 'PostCreated',
		data: {
			id,
			title,
		},
	});

	res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
	console.log('Event Received ', req.body.type);
	res.send({});
});

app.listen(port, () => {
	console.log(`Posts Service is Listening on port ${port}`);
});
