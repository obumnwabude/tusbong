const functions = require('firebase-functions');

exports.sandbox = functions.https.onRequest((req, res) => res.send(functions.config().sandbox.key));