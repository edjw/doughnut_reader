'use strict';

const Mercury = require('@postlight/mercury-parser');

exports.handler = async (event, context) => {
	const referer = event.headers.referer;
	const requestFromURL = referer.substring(0, referer.length - 1);
	const mySite = process.env.URL;

	if (requestFromURL != mySite) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: "Don't use my functions, please" })
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