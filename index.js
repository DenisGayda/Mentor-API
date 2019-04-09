const firebase = require("firebase-admin");
const express = require("express");
const app = express();
const serviceAccount = require("./serviceAccountKey.json");
const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
});

app.get('/', (req, res) => {
	return res.send('Received a GET HTTP method');
});

app.post('/', (req, res) => {
	return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
	return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
	return res.send('Received a DELETE HTTP method');
});

app.listen(server_port, () =>
	console.log(`Example app listening on port ${server_port}!`),
);
