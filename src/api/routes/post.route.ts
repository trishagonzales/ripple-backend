import express, { Request, Response } from 'express';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import { PostService } from '../../services/PostService';

const router = express.Router();

/**
 * Get all posts
 */
router.get(
  '/posts',
  a(async (req, res) => {
    const posts = await PostService.getAllPosts(req.query);
    return res.status(200).send(posts);
  })
);

/**
 * Get all posts from a single user
 */
router.get(
  '/posts/user/:id',
  a(async (req, res) => {
    const userID = req.params.id;
    const posts = await PostService.getUserPosts(userID, req.query);

    return res.status(200).send(posts);
  })
);

/**
 *  Get liked posts
 */
router.get(
  '/posts/liked-posts',
  auth,
  a(async (req, res) => {
    const posts = await PostService.getLikedPosts(req.user._id, req.query);

    res.status(200).send(posts);
  })
);

/**
 * Get one post
 */
router.get(
  '/posts/:id',
  a(async (req, res) => {
    const post = await PostService.getOnePost(req.params.id);
    res.status(200).send(post);
  })
);

/**
 * Create new post
 */
router.post(
  '/posts',
  auth,
  a(async (req, res) => {
    const validInput = validate(req.body, 'post');
    const post = await PostService.createNewPost(validInput, req.user._id);

    res.status(201).send(post);
  })
);

/**
 * Update post
 */
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

/**
 * Delete post
 */
router.delete(
  '/posts/:id',
  auth,
  a(async (req, res) => {
    const post = await PostService.deletePost(req.params.id);

    res.status(200).send(post);
  })
);

router.put(
  '/posts/:id/likes',
  auth,
  a(async (req: Request, res: Response) => {
    const user = req.user;
    await user.likePost(req.params.id);

    res.status(200).send('Successfully liked post');
  })
);

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
