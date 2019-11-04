'use strict';

const Mercury = require('@postlight/mercury-parser');
// const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
	const requestFromURL = event['headers']['host'];
	const mySite = process.env.URL;
	const mySiteHost = mySite.split("://")[1];

	if (requestFromURL != mySiteHost) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: "Don't use my functions, please" }),
		};
	}

	// const mercurySecret = process.env.mercury_secret;
	// const hashOfSecret = process.env.hash_of_mercury_secret;
	// if (!bcrypt.compareSync(mercurySecret, hashOfSecret)) {
	// 	return {
	// 		statusCode: 403,
	// 		body: JSON.stringify({ error: 'missing or wrong secret' }),
	// 	};
	// }

	const url = event.queryStringParameters.qs;

	if (!url) {
		return {
			statusCode: 422,
			body: JSON.stringify({ error: "missing URL, use ?qs=[url]" })
		};
	}

	try {
		const parsed = await Mercury.parse(url);

		return {
			statusCode: 200,
			body: JSON.stringify(parsed)
		}
	} catch (error) {
		return {
			statusCode: 404,
			body: JSON.stringify(error)
		}
	}
};