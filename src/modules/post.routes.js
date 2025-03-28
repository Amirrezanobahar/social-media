import express from 'express'
import { allMedia, createPost } from './post.controller.js'
import { auth } from '../middlewares/auth.js'
import { verifyAccount } from '../middlewares/verifyAccount.js'
import { multerStorage } from '../middlewares/fileUploader.js'

const upload = multerStorage('./../public/images/posts', /jpg|jpeg|webp|png|mp4|mkv/)

export const router = express.Router()

router.route('/').get(auth, verifyAccount, allMedia).post(auth, upload.single('media'), createPost)
