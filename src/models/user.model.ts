import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { Post } from './post.model';

export interface User {
  email: string;
  password: string;
  profile: UserProfile;
  posts: Post[];
  likedPosts: Post[];
}

export interface UserProfile {
  avatar?: string;
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female' | 'not specified';
  age?: number;
  bio?: string;
  location?: string;
}

export interface UserDocument extends User, mongoose.Document {
  generateToken(): string;
  validatePassword(password: string): Promise<boolean>;
}

export interface UserModel extends mongoose.Model<UserDocument> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    required: true
  },

  profile: new mongoose.Schema({
    avatar: { type: String, maxlength: 255 },
    firstName: { type: String, maxlength: 255, trim: true, required: true },
    lastName: { type: String, maxlength: 255, trim: true, required: true },
    gender: { type: String, enum: ['male', 'female', 'not specified'] },
    age: { type: Number, min: 1, max: 1000 },
    bio: { type: String, maxlength: 1024 },
    location: { type: String, maxlength: 255 }
  }),

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

/**
 * Generate auth token using user's id
 * @returns JWT token
 */
userSchema.methods.generateToken = function() {
  return jwt.sign({ _id: this._id }, config.JWT_KEY);
};

/**
 * @param password input password
 * @returns Promise obj - whether input password is valid
 */
userSchema.methods.validatePassword = function(password) {
  return bcryptjs.compare(password, this.password);
};

/**
 * @param passsword input password
 * @returns Promise obj - hashed password
 */
userSchema.statics.hashPassword = async function(password) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const UserModel: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default UserModel;
