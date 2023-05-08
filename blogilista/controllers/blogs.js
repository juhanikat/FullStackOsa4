const express = require("express")
const blogsRouter = express.Router()
blogsRouter.use(express.json())
const Blog = require("../models/blog.js")
const User = require("../models/user.js")



blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
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
	const user = await User.findOne({})
	blog.user = user
	const result = await blog.save()
	user.blogs = user.blogs.concat(blog._id)
	await user.save()
	response.status(201).json(result)
})

blogsRouter.put("/:id", async (request, response) => {
	try {
		const newBlog = request.body
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog)
		if (updatedBlog) {
			response.status(204).end()
		} else {
			response.status(400).send({ "error": "Invalid id" }).end()
		}
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
})

blogsRouter.delete("/:id", async (request, response) => {
	try {
		const deletedBlog = await Blog.findById(request.params.id)
		if (deletedBlog) {
			await Blog.deleteOne(deletedBlog)
			response.status(204).end()
		} else {
			response.status(400).send({ "error": "Invalid id" }).end()
		}
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
})

module.exports = blogsRouter