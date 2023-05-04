const blogsRouter = require("express").Router()
const express = require("express")
const Blog = require("../models/blog.js")
blogsRouter.use(express.json())


blogsRouter.get("/", (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			response.json(blogs)
		})
})

blogsRouter.post("/", (request, response) => {
	if (!(request.body.likes)) {
		request.body.likes = 0
	}
	const blog = new Blog(request.body)

	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})

module.exports = blogsRouter