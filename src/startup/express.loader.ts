import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import getAPI from '../api/index.api';
import { errorHandler } from '../util/errorHandler';
const log = require('debug')('express.loader');

const expressLoader = (app: Express) => {
  try {
    //  Configurations
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('tiny'));

    getAPI(app);

    errorHandler(app);

    log('Express initialized ...');
  } catch (e) {
    log(e);
  }
};

export default expressLoader;
