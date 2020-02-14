import mongoose from 'mongoose';
import config from '../config/config';
const log = require('debug')('db.loader');

const dbLoader = async () => {
	try {
		await mongoose.connect(config.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});

		log('Connected to MongoDB ...');
	} catch (e) {
		log('Failed to connect to MongoDB.\n' + e);
	}
};

export default dbLoader;
