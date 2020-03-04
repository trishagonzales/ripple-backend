const log = require('debug')('config');

const env = process.env.NODE_ENV || 'development';

// Set differing properties
const config = {
  development: {
    MONGO_URI: process.env.MONGO_URI_DEV
  },
  test: {
    MONGO_URI: process.env.MONGO_URI_TEST
  },
  production: {
    MONGO_URI: process.env.MONGO_URI_PROD
  }
};

// Set common properties
config[env].PORT = process.env.PORT || 3001;
config[env].JWT_KEY = process.env.JWT_KEY;

// Check for missing required variables
try {
  if (!config[env].MONGO_URI) throw new Error('MONGO_URI not set.');
  if (!config[env].JWT_KEY) throw new Error('JWT_KEY not set.');
} catch (e) {
  log(e.message);
  throw e;
}

export default config[env];
