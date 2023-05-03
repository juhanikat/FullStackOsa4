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

afterAll(async () => {
	await mongoose.connection.close()
})