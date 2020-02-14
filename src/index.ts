require('dotenv').config();
import express from 'express';
import config from './config/config';
import dbLoader from './startup/db.loader';
import expressLoader from './startup/express.loader';
const log = require('debug')('app');

const app = express();

dbLoader();
expressLoader(app);

//  Start server
const server = app.listen(config.PORT, (err) => {
	return err
		? log(`Failed to start server. ${err}`)
		: log(`App started on port ${config.PORT} in ${process.env.NODE_ENV} mode.`);
});

export default server;
