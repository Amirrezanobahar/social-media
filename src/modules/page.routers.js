import express from 'express';
import { getPage,followUser,unfollowUser } from './page.controller.js'
import { auth } from '../middlewares/auth.js';

export const router = new express.Router();

router.route('/:pageID').get(auth,getPage)
router.route('/:pageID/follow').post(auth,followUser)
router.route('/:pageID/unfollow').post(auth,unfollowUser)
