const mongoose = require("mongoose")
const Blog = require("../models/blog.js")
const supertest = require("supertest")
const app = require("../app.js")

const api = supertest(app)

const initialBlogs = [
	{
		title: "test1",
		author: "me",
		url: "fake_url",
		likes: 2
	},
	{
		title: "test2",
		author: "you",
		url: "fake_url",
		likes: 0
	}
]

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(initialBlogs[1])
	await blogObject.save()
})

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/)
})

test("right amount of blogs are returned", async () => {
	const response = await api.get("/api/blogs")
	expect(response.statusCode).toBe(200)
	expect(response.body).toHaveLength(initialBlogs.length)
})

test("blogs have id", async () => {
	const response = await api.get("/api/blogs")
	expect(response.statusCode).toBe(200)
	for (const blog of response.body) {
		expect(blog.id).toBeDefined()
	}
})

test("blogs can be added with post request", async () => {
	const newBlog = {
		title: "test3",
		author: "someone",
		url: "fake_url",
		likes: 999
	}
	const postResponse = await api.post("/api/blogs", newBlog)
	expect(postResponse.statusCode).toBe(201)

	const getResponse = await api.get("/api/blogs")
	expect(getResponse.statusCode).toBe(200)
	expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
})

test("blogs with no likes value have 0 likes", async () => {
	const newBlog = {
		title: "test4",
		author: "somebody else",
		url: "fake_url"
	}

	const response = await api.post("/api/blogs", newBlog)
	expect(response.body.likes).toBeDefined()
	expect(response.body.likes).toBe(0)
})

afterAll(async () => {
	await mongoose.connection.close()
})