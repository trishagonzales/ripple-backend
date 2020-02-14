const log = require('debug')('errorHandler');

export const errorHandler = (app) => {
	app.use((err, req, res, next) => {
		if (err.statusCode) return res.status(err.statusCode).send(err.message);

		log(err);
		res.status(500).send('Unexpected error occurred.');
	});
};

export class HttpError extends Error {
	public name = 'HttpError';
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}
