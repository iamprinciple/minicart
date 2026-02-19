const express = require("express")
const { signUser, loginUser, getUserprofile, getUser } = require("../controllers/userController")
const userRouter = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const userAuth = require("../middleware/userAuth")

userRouter.post("/user/signup", signUser)
userRouter.post("/login", loginUser)
userRouter.get("/currentuser", authMiddleware, userAuth, getUserprofile )
userRouter.get("/getusers", getUser)

module.exports = userRouter