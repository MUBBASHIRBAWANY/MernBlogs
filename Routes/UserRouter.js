import express from "express";
import { userLogin, userProfile, userRegister } from "../Controllar/userControllar.js";
import uploads from "../Midelware/CloudNaryHelper.js";
const app = express()
const UserRouter = express.Router()



UserRouter.post('/', uploads.fields([
    {name: 'image', maxCount: 1},
]),userRegister)

UserRouter.post('/Login', userLogin)
UserRouter.post('/profile', userProfile)


export default UserRouter