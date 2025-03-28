
import { model as userModel } from '../models/user.js'
import { model as refreshTokenModel } from '../models/refreshToken.js'
import { errorResponse, successResponse } from '../utils/errorResponse.js'
import { registerValidation, loginValidation } from './auth.Validation.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import flash from 'express-flash'
export const register = async (req, res, next) => {
    try {
        const { email, username, name, password } = req.body;

        // Validate input
        const isValid = registerValidation.validate({
            email,
            username,
            name,
            password,
        });
        if (isValid.error) {
            return errorResponse(res, 400, isValid.error.details[0].message);
        }

        // Check if user already exists
        const isExistUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });
        if (isExistUser) {
            req.flash('error', 'Email or username already exists');
            return res.redirect('/auth/register');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine role (ADMIN if first user, otherwise USER)
        const isFirstUser = (await userModel.countDocuments()) === 0;
        const role = isFirstUser ? 'ADMIN' : 'USER';

        // Create and save user
        let user = new userModel({ email, username, name, password: hashedPassword, role });
        user = await user.save();

        // Generate access token
        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // 30 days
        });

        // Generate refresh token
        const refreshToken = await refreshTokenModel.createToken(user);

        // Set cookies
        const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        res.cookie('access-token', accessToken, { maxAge: thirtyDaysInMilliseconds, httpOnly: true });
        res.cookie('refresh-token', refreshToken, { maxAge: thirtyDaysInMilliseconds, httpOnly: true });

        // Set success flash message and redirect
        req.flash('success', 'Signed up successfully');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // validate
        const isValid = await loginValidation.validate({
            username,
            password
        })

        if (!isValid) {
            req.flash('error', 'Invalid username or password');
        }

        // Find user by username
        const user = await userModel.findOne({ username }).lean();
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/auth/login');
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            req.flash('error', 'Username or password is incorrect');
            return res.redirect('/auth/login');
        }

        // Generate access token
        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // 30 days
        });

        // Generate refresh token
        const refreshToken = await refreshTokenModel.createToken(user);

        // Set cookies
        const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        res.cookie('access-token', accessToken, { maxAge: thirtyDaysInMilliseconds, httpOnly: true });
        res.cookie('refresh-token', refreshToken, { maxAge: thirtyDaysInMilliseconds, httpOnly: true });

        // Set success flash message and redirect
        req.flash('success', 'Signed in successfully');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};