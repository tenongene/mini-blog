const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 4005;
app.use(bodyParser.json());

const allEvents = [];

app.post('/events', (req, res) => {
	const event = req.body;
	allEvents.push(event);

	axios
		.post('http://posts-svc-clusterip:4000/events', event)
		.then((resp) => resp)
		.catch((err) => err.message);

	axios
		.post('http://comments-svc:4001/events', event)
		.then((resp) => resp)
		.catch((err) => err.message);

	axios
		.post('http://query-svc:4002/events', event)
		.then((resp) => resp)
		.catch((err) => err.message);

	axios
		.post('http://moderation-svc:4003/events', event)
		.then((resp) => resp)
		.catch((err) => err.message);

	res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
	res.send(allEvents);
});

app.listen(port, () => {
	console.log(`Event Bus is listening on port ${port}`);
});
