const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 4003;
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
	const { type, data } = req.body;

	if (type === 'CommentCreated') {
		const status = data.content.toLowerCase().includes('orange') ? 'rejected' : 'approved';

		const moderated = {
			type: 'CommentModerated',
			data: {
				id: data.id,
				content: data.content,
				postId: data.postId,
				status,
			},
		};
		console.log(`Comment Moderated, status: ${status}`);

		await axios.post('http://event-bus-svc:4005/events', moderated);
	} else if (type === 'PostCreated') {
		console.log('Event Received PostCreated');
	}

	res.send({});
});

app.listen(port, () => {
	console.log(`Moderation Service is Listening on port ${port}`);
});
