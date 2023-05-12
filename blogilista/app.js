const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs.js")
const usersRouter = require("./controllers/users.js")
const loginRouter = require("./controllers/login.js")
const middleware = require("./middleware.js")
const cors = require("cors")
require("dotenv").config()

const express = require("express")
const app = express()
app.use(express.json())
app.use(cors())


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

module.exports = app