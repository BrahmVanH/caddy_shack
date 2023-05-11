const jwt = require('jsonwebtoken');

const secret = process.env.AUTH_SECRET;
const expiration = '2h';

module.exports = {
	signToken: ({ username, _id }) => {
		const payload = { username, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
	authMiddleware: ({ req }) => {
		let token = req.query.token || req.headers.authorization;
		if (req.headers.authorization) {
			token = token.split(' ').pop().trim();
		}

		if (!token) {
			return req;
		}

		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log('invalid token');
		}
		return req;
	},
};
