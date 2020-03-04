import express, { Request, Response } from 'express';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import { PostService } from '../../services/PostService';

const router = express.Router();

//  GET ALL POSTS
router.get(
  '/posts',
  a(async (req, res) => {
    const posts = await PostService.getAllPosts(req.query);
    return res.status(200).send(posts);
  })
);

//  GET ALL POSTS FROM A SINGLE USER
router.get(
  '/posts/user/:id',
  a(async (req, res) => {
    const userID = req.params.id;
    const posts = await PostService.getUserPosts(userID, req.query);

    return res.status(200).send(posts);
  })
);

//  GET LIKED POSTS
router.get(
  '/posts/liked-posts',
  auth,
  a(async (req, res) => {
    const posts = await PostService.getLikedPosts(req.user._id, req.query);

    res.status(200).send(posts);
  })
);

//  GET ONE POST
router.get(
  '/posts/:id',
  a(async (req, res) => {
    const post = await PostService.getOnePost(req.params.id);
    res.status(200).send(post);
  })
);

//  CREATE NEW POST
router.post(
  '/posts',
  auth,
  a(async (req, res) => {
    const validInput = validate(req.body, 'post');
    const post = await PostService.createNewPost(validInput, req.user._id);

    res.status(201).send(post);
  })
);

//  UPDATE POST
router.put(
  '/posts/:id',
  auth,
  a(async (req, res) => {
    const validInput = validate(req.body, 'post');
    const { params, user } = req;
    const post = await PostService.updatePost(validInput, params.id, user._id);

    res.status(201).send(post);
  })
);

//  DELETE POST
router.delete(
  '/posts/:id',
  auth,
  a(async (req, res) => {
    const post = await PostService.deletePost(req.params.id);

    res.status(200).send(post);
  })
);

//  LIKE A POST
router.put(
  '/posts/:id/likes',
  auth,
  a(async (req: Request, res: Response) => {
    const user = req.user;
    await user.likePost(req.params.id);

    res.status(200).send('Successfully liked post');
  })
);

//  UNLIKE A POST
router.put(
  '/posts/:id/unlikes',
  auth,
  a(async (req, res) => {
    const user = req.user;
    await user.unlikePost(req.params.id);

    res.status(200).send('Successfully unliked post');
  })
);

export default router;
