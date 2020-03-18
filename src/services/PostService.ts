import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import { HttpError } from '../util/errorHandler';

export interface QueryParams {
  pageSize: number;
  pageNumber: number;
  sortBy?: string;
}

export class PostService {
  //  GET FEED / ALL POSTS FROM DATABASE
  public static async getAllPosts(queryParams?: QueryParams) {
    const { pageSize, pageNumber, sortBy } = queryParams;
    const posts = await PostModel.find({})
      .populate('author', 'profile.firstName profile.lastName profile.avatar -_id')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort(sortBy);

    return posts;
  }

  //  GET ALL POSTS FROM ONE USER
  public static async getUserPosts(userID: string, queryParams?: QueryParams) {
    const { pageSize, pageNumber, sortBy } = queryParams;

    const user = await UserModel.findById(userID);
    if (!user) throw new HttpError('User not found.', 400);

    const posts = await PostModel.find({ author: userID })
      .populate('author', 'profile.firstName profile.lastName profile.avatar -_id')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort(sortBy);

    return posts;
  }

  //  GET ALL LIKED POSTS
  public static async getLikedPosts(userID: string, queryParams?: QueryParams) {
    const user = await UserModel.findById(userID).populate('likedPosts');
    return user.likedPosts;
  }

  //  GET A SINGLE POST
  public static async getOnePost(postID: string) {
    const post = await PostModel.findById(postID).populate(
      'author',
      '_id profile.firstName profile.lastName image'
    );
    if (!post) throw new HttpError('Post not found.', 404);

    return post;
  }

  //  CREATE NEW POST
  public static async createNewPost(input: { title: string; body: string }, authorID: string) {
    const newPost = new PostModel({
      title: input.title,
      body: input.body,
      author: authorID
    });
    return await newPost.save();
  }

  //  UPDATE POST
  public static async updatePost(
    newPost: { title: string; body: string },
    postID: string,
    userID: string
  ) {
    const post = await PostModel.findById(postID);
    if (!post) throw new HttpError('Post not found.', 404);

    //  Validate if user owns the post
    if (JSON.stringify(post.author) != JSON.stringify(userID))
      throw new HttpError('Access denied.', 401);

    post.title = newPost.title;
    post.body = newPost.body;
    post.lastModified = Date.now();

    await post.save();
    return post;
  }

  //  DELETE POST
  public static async deletePost(postID: string) {
    const deletedPost = await PostModel.findByIdAndDelete(postID);
    if (!deletedPost) throw new HttpError('Post not found.', 404);
    return deletedPost;
  }

  //  GET IMAGE PATH OF POST
  public static async getImage(postID: string) {
    const post = await PostModel.findById(postID);
    if (!post.image) throw new HttpError('No image found.', 404);
    return post.image;
  }

  //  UPLOAD/UPDATE IMAGE
  public static async uploadImage(filename: string, postID: string, userID: string) {
    const post = await PostModel.findById(postID);
    if (!post) throw new HttpError('Post not found', 404);

    //  Validate if user owns the post
    if (JSON.stringify(post.author) != JSON.stringify(userID))
      throw new HttpError('Access denied.', 401);

    post.image = filename;
    await post.save();
    return post.image;
  }
}
