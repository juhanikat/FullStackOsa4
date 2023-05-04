const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs.js")
const cors = require("cors")
require("dotenv").config()

const express = require("express")
const app = express()
app.use(cors())
app.use(express.json())

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)



app.use("/api/blogs", blogsRouter)

module.exports = app