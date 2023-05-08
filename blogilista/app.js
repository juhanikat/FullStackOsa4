const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs.js")
const usersRouter = require("./controllers/users.js")
const cors = require("cors")
require("dotenv").config()

const express = require("express")
const app = express()
app.use(cors())


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

module.exports = app