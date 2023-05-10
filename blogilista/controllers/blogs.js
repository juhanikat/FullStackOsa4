const express = require("express")
const jwt = require("jsonwebtoken")
const blogsRouter = express.Router()
blogsRouter.use(express.json())
const Blog = require("../models/blog.js")
const User = require("../models/user.js")



blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
	response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
	if (!(request.body.title && request.body.url)) {
		response.status(400).json({error: "no title or url"})
		return
	}
	if (!(request.body.likes)) {
		request.body.likes = 0
	}

	let decodedToken = null
	try {
		decodedToken = jwt.verify(request.body.token, process.env.SECRET) 
		
	} catch(error) {
		console.log(error)
		if (error.name === "JsonWebTokenError") {
			return response.status(400).json({ error: "token missing or invalid" })
		}}

	if (!decodedToken.id) {   
		return response.status(401).json({ error: "token invalid" }) 
	}  
	const user = await User.findById(decodedToken.id)
	const blog = new Blog(request.body)
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
	let deletedBlog = null
	try {
		deletedBlog = await Blog.findById(request.params.id)
		if (!(deletedBlog)) {
			response.status(400).send({ "error": "Invalid id" }).end()
			return
		}	
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}

	let decodedToken = null
	try {
		decodedToken = jwt.verify(request.body.token, process.env.SECRET) 
	} catch(error) {
		console.log(error)
		if (error.name === "JsonWebTokenError") {
			return response.status(400).json({ error: "token missing or invalid" })
		}}

	if (!decodedToken.id) {   
		return response.status(401).json({ error: "token invalid" }) 
	}

	const user = await User.findById(decodedToken.id)
	if (!(deletedBlog.user.toString() === user.id.toString())) {
		console.log(deletedBlog.user.toString(), user.id.toString())
		return response.status(400).json({ error: "wrong account" })
	}
	await Blog.deleteOne(deletedBlog)
	//the next message doesn't get sent for some reason? everything else works
	return response.status(204).json({message: `blog ${deletedBlog.id} deleted`})
})

module.exports = blogsRouter