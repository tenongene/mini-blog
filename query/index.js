const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4002;
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;
		posts[postId].comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, postId, content, status } = data;
		const post = posts[postId];
		const comment = post.comments.find((comment) => comment.id === id);

		comment.status = status;
		comment.content = content;
	}
};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;
	handleEvent(type, data);

	console.log(posts);
	res.send({});
});

app.listen(port, async () => {
	console.log(`Query Service is Listening on port ${port}`);

	try {
		const res = await axios.get('http://event-bus-svc:4005/events');

		for (let event of res.data) {
			console.log('Processing event: ', event.type);

			handleEvent(event.type, event.data);
		}
	} catch (err) {
		console.log(err.message);
	}
});
