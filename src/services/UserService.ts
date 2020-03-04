import UserModel, { UserProfile } from '../models/user.model';
import PostModel from '../models/post.model';
import { HttpError } from '../util/errorHandler';
import { QueryParams } from './PostService';

export class UserService {
  public _id: string;

  constructor(id: string) {
    this._id = id;
  }

  //  GET ALL PROFILES
  public static async getAllProfiles(queryParams: QueryParams) {
    const { pageSize, pageNumber, sortBy } = queryParams;
    const users = await UserModel.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort(sortBy)
      .select('profile');

    const profiles = users.map(user => user.profile);

    return profiles;
  }

  //  GET A SINGLE PROFILE
  public static async getProfile(userID: string) {
    const user = await UserModel.findOne({ _id: userID });
    if (!user) throw new HttpError('No user profile found.', 404);

    return user.profile;
  }

  //  GET AVATAR IMAGE
  public static async getAvatar(userID: string) {
    const user = await UserModel.findById(userID);
    return user.profile.avatar;
  }

  //  UPDATE PROFILE
  public async updateProfile(newProfile: UserProfile) {
    const user = await UserModel.findById(this._id);
    user.profile = { ...newProfile };
    const { profile } = await user.save();

    return profile;
  }

  //  UPDATE/UPLOAD AVATAR IMAGE
  public async uploadAvatar(path: string) {
    const user = await UserModel.findById(this._id);
    user.profile.avatar = path;
    await user.save();
  }

  //  GET USER / ACCOUNT DATA
  public async getAccountData() {
    const user = await UserModel.findById(this._id).select('email profile');
    return user;
  }

  //  UPDATE EMAIL
  public async updateEmail(newEmail: string) {
    const user = await UserModel.findById(this._id);
    user.email = newEmail;
    await user.save();

    return user.email;
  }

  //  UPDATE PASSWORD
  public async updatePassword(newPassword: string) {
    const user = await UserModel.findById(this._id);
    const hashedPass = await UserModel.hashPassword(newPassword);
    user.password = hashedPass;
    await user.save();
  }

  //  VALIDATE PASSWORD
  public async validatePassword(password: string) {
    const user = await UserModel.findById(this._id);
    const isPassValid = await user.validatePassword(password);
    if (!isPassValid) throw new HttpError('Invalid password.', 400);
  }

  //  DELETE ACCOUNT
  public async deleteAccount() {
    const user = await UserModel.findById(this._id);
    if (!user) throw new HttpError('User not found.', 404);

    await UserModel.deleteOne({ _id: this._id });
  }

  //  ADD USER TO LIKE LIST
  public async likePost(postID: string) {
    const post = await PostModel.findOne({ _id: postID });
    if (!post) throw new HttpError('Post not found.', 404);

    const user = await UserModel.findById(this._id);
    //  User already liked this post
    if (post.likes.indexOf(user._id) !== -1)
      throw new HttpError('User already liked this post.', 400);
    //  User haven't liked this post yet
    post.likes.push(user._id);
    await post.save();
  }

  //  REMOVE USER FROM LIKE LIST
  public async unlikePost(postID: string) {
    const post = await PostModel.findOne({ _id: postID });
    if (!post) throw new HttpError('No post found.', 404);

    const user = await UserModel.findById(this._id);
    const userIndex = post.likes.indexOf(user._id);
    //  User not on liked list
    if (userIndex === -1) throw new HttpError('User already unliked this post.', 400);
    //  User is on liked list
    post.likes.splice(userIndex, 1);
  }
}
