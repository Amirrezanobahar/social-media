import flash from "express-flash"
import { model as userModel } from "../models/user.js"

export const verifyAccount = async (req, res, next) => {

    const id = req.user._id

    const userVerify = await userModel.findOne({ _id: id }).lean()
    if (!userVerify.isVerified) {
        req.flash('message', 'You need to verify your account')
        return res.render('postUpload/index.ejs')
    }


    next()


}