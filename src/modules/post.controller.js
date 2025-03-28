

import { uploadPOstValidation } from "./post.Validation.js";
import { model as postModel } from "../models/post.js";
import fs from 'fs';
import path from 'path';

export const allMedia = async (req, res) => {
    res.render('./postupload/index.ejs')
}


export const createPost = async (req, res) => {
    const { description, hashtags } = req.body;

    // Validate input
    const validationResult = uploadPOstValidation.validate({ description });
    if (validationResult.error) {
        req.flash('error', validationResult.error.details[0].message);
        return res.redirect('/upload'); // Redirect back to the upload page
    }

    // Check if a file was uploaded
    if (!req.file) {
        req.flash('error', 'Please select a file');
        return res.redirect('/upload');
    }

    // Process hashtags
    const tags = hashtags?.split(',').map(tag => tag.trim());

    // Construct media path
    const mediaUploadPath = path.join('images/posts', req.file.filename);

    try {
        // Create and save the post
        const post = new postModel({
            media: {
                path: mediaUploadPath,
                filename: req.file.filename
            },
            description,
            hashtags: tags,
            user: req.user._id
        });

        await post.save();

        // Flash success message and redirect
        req.flash('success', 'Post created successfully');
        res.redirect('/');
    } catch (error) {
        // Delete the uploaded file if an error occurs
        const fullPath = path.join('public', 'images', mediaUploadPath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath); // Delete the file
        }

        // Flash error message and redirect
        req.flash('error', 'Failed to create post');
        res.redirect('/upload');
    }
};