import { accessToPage } from "../utils/accessToPage.js";
import { model as followModel } from "../models/follow.js";
import { model as userModel } from "../models/user.js";
import flash from "express-flash";

export const getPage = async (req, res, next) => {
    try {
        const userID = req.user._id
        // Check if the user has access to the page
        const hasAccess = await accessToPage(req, res, next);

        if (!hasAccess) {
            req.flash("error", "follow page to show content");
            return res.render('page/index');
        }

        const followed = await followModel.findOne({
            follower: userID,
            followed: req.params._id,
        })

        let followers =await followModel.find({ following: '67dc0e9685d7f558df96770d'},'-createdAt -updatedAt -__v').populate('follower','email username').lean()
        console.log(followers);
        
        

        // Redirect to the user's page
        return res.render('page/index', {
            userID: userID,
            followed: Boolean(followed),
            followers
        });

    } catch (err) {
        // Log the error for debugging
        console.error("Error in getPage:", err);

        // Flash a generic error message
        req.flash("error", "An error occurred while processing your request");

        // Pass the error to the next middleware
        next(err);
    }
};


export const followUser = async (req, res, next) => {

    try {
        const userID = req.user._id
        const { pageID } = req.params

        const targetOwnPage = await userModel.find({ _id: pageID })
        if (!targetOwnPage) {
            req.flash("error", "page not found to follow")
            return res.redirect(`/page/${pageID}`)
        }

        console.log('userID=>', userID, '\npageID=>', pageID);

        if (userID === String(pageID)) {

            req.flash("error", "you can't follow yourself")
            return res.redirect(`/page/${pageID}`)

        }

        const existingFollow = await followModel.find({
            follower: userID,
            following: pageID
        }).lean()
        console.log(existingFollow);


        if (existingFollow.length > 0) {
            req.flash("error", "you are already following this page")
            return res.redirect(`/page/${pageID}`)
        }



        const follow = new followModel({ follower: userID, following: pageID })
        await follow.save()
        if (follow) {
            return res.redirect(`/page/${pageID}`)
        }
    } catch (err) {
        next(err)
    }

}

export const unfollowUser = async (req, res) => {

    const userID = req.user._id
    const { pageID } = req.params

    const unfollowUser = await followModel.findOneAndDelete({
        follower: userID,
        following: pageID
    })
    if (!unfollowUser) {
        req.flash("error", "you are not following this page")
        return res.redirect(`/page/${pageID}`)
    }

    return res.redirect(`/page/${pageID}`)


}