import { model as userModel } from "../models/user.js";
import { model as followModel } from "../models/follow.js";
import { isValidObjectId } from "mongoose";
import flash from "express-flash";
export const accessToPage = async (req, res, next) => {

    const { pageID } = req.params;
    const userID = req.user._id

    if(!isValidObjectId(pageID)||!isValidObjectId(userID)){
        req.flash( "error", "Invalid ID" );
        return res.redirect("/");
    }

    if (pageID === userID) {
        return true
    }

    const isPrivet = await userModel.findOne({ _id: pageID, private: true });

    if (!isPrivet) {
        return true
    }

    const isFollowed = await followModel.findOne({ follower: pageID, followed: pageID })

    if (isFollowed) {
        return true
    }






}