import mongoose from 'mongoose';

export interface Post {
  title: string;
  body: string;
  author: mongoose.Schema.Types.ObjectId;
  image?: string;

  dateCreated: number;
  lastModified?: number;
  likes?: mongoose.Schema.Types.ObjectId[];
}

export interface PostDocument extends Post, mongoose.Document {}
export interface PostModel extends mongoose.Model<PostDocument> {}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 255,
    trim: true,
    required: true
  },
  body: {
    type: String,
    maxlength: 2048
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    maxlength: 255
  },

  dateCreated: { type: Date, default: Date.now, required: true },
  lastModifed: { type: Date },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const PostModel: PostModel = mongoose.model<PostDocument, PostModel>('Post', postSchema);

export default PostModel;
