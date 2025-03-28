import express from 'express'
import { register , login } from './auth.controller.js'
export const router = express.Router()

export const showRegisterView = async (req, res) => {
    res.render('./auth/register.ejs')
}
router.route('/register').get(showRegisterView).post(register)
router.get('/', (req, res) => {
    res.send({ message: 'hello world' })
})

export const showLoginPage=async(req,res)=>{
    res.render('./auth/login.ejs')
}

router.route('/login').get(showLoginPage).post(login)