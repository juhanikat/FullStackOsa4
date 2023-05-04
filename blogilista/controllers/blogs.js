const express = require("express")
const blogsRouter = express.Router()
blogsRouter.use(express.json())
const Blog = require("../models/blog.js")



blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
	if (!(request.body.title) || !(request.body.url)) {
		response.status(400).end()
		return
	}
	if (!(request.body.likes)) {
		request.body.likes = 0
	}
	const blog = new Blog(request.body)
	const result = await blog.save()
	response.status(201).json(result)
})

module.exports = blogsRouter