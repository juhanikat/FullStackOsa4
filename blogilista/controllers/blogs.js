const express = require("express")
const blogsRouter = express.Router()
blogsRouter.use(express.json())
const Blog = require("../models/blog.js")


blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
	return response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
	if (!(request.body.title && request.body.url)) {
		return response.status(400).json({error: "no title or url"})
	}
	if (!(request.body.likes)) {
		request.body.likes = 0
	}
	const user = request.body.user
	if (!(user)) {
		return response.status(401).json({error: "Invalid user"})
	}
	const blog = new Blog(request.body)
	blog.user = user
	const result = await blog.save()
	user.blogs = user.blogs.concat(blog._id)
	await user.save()
	return response.status(201).json(result)
})

blogsRouter.put("/:id", async (request, response) => {
	try {
		const newBlog = request.body
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog)
		if (updatedBlog) {
			return response.status(204).end()
		} else {
			return response.status(400).send({ "error": "Invalid id" }).end()
		}
	} catch (error) {
		console.log(error)
		return response.status(500).end()
	}
})

blogsRouter.delete("/:id", async (request, response) => {
	let deletedBlog = null
	try {
		deletedBlog = await Blog.findById(request.params.id)
		if (!(deletedBlog)) {
			return response.status(400).send({ "error": "Invalid id" })
			
		}	
	} catch (error) {
		console.log(error)
		return response.status(500).end()
	}

	const user = request.body.user
	if(!(user)) {
		return response.status(401).send({error: "Invalid user"})
	}
	if (!(deletedBlog.user.toString() === user.id.toString())) {
		return response.status(400).json({ error: "wrong account" })
	}
	await Blog.deleteOne(deletedBlog)
	//the next message doesn't get sent for some reason? everything else works
	return response.status(204).json({message: `blog ${deletedBlog.id} deleted`})
})

module.exports = blogsRouter