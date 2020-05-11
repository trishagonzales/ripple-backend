import Joi from '@hapi/joi';
import { HttpError } from '../../util/errorHandler';

type ValidationSchema = 'signup' | 'login' | 'profile' | 'email' | 'password' | 'post';

const schemas = {
  //  SIGNUP
  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
  }),

  //  LOGIN
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  //  PROFILE
  profile: Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    gender: Joi.string(),
    age: Joi.number().min(1).max(1000),
    bio: Joi.string().max(1024),
    location: Joi.string().max(255),
  }),

  //  EMAIL
  email: Joi.string().min(2).max(255).email().required(),

  //  PASSWORD
  password: Joi.string().min(6).max(255).required(),

  //  POST
  post: Joi.object({
    title: Joi.string().min(1).max(512).required(),
    body: Joi.string().min(1).max(5000).required(),
  }),
};

const validate = <T>(inputToValidate: T, schema: ValidationSchema): T => {
  const { value, error } = schemas[schema].validate(inputToValidate);

  if (error) throw new HttpError(`Invalid Input. ${error.message}`, 400);

  return value;
};

export default validate;
