import express from "express"
import db from "./db/db.js"
import UserRouter from "./Routes/UserRouter.js"

const Router = express.Router()
const app = express()

let dataBase = db
dataBase()

export const users = app.use('/', UserRouter)


