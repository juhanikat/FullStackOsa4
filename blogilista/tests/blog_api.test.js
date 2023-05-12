const mongoose = require("mongoose")
const express = require("express")
const Blog = require("../models/blog.js")
const User = require("../models/user.js")
const supertest = require("supertest")
const app = require("../app.js")
app.use(express.json())

const api = supertest(app)

let token = null
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
	const user = await User.findOne({username: "supertest"})
	await Blog.deleteMany({})
	let blogObject = new Blog(initialBlogs[0])
	blogObject.user = user
	await blogObject.save()
	blogObject = new Blog(initialBlogs[1])
	blogObject.user = user
	await blogObject.save()

	const loginResponse = await api
		.post("/api/login")
		.send({"username": "supertest", "password": "supertest"})
	token = "Bearer " + loginResponse.body.token
	console.log(token)
})

describe("when getting blogs", () => {
	test("they are returned as json", async () => {
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
})

describe("adding blog", () => {
	test("with valid token succeeds", async () => {
		const newBlog = {
			title: "test3",
			author: "someone",
			url: "fake_url",
			likes: 999
		}
		const postResponse = await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send(newBlog)
		console.log(postResponse)
		expect(postResponse.statusCode).toBe(201)
	
		const getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
	})
	
	test("without token fails", async () => {
		const newBlog = {
			title: "test3",
			author: "someone",
			url: "fake_url",
			likes: 999
		}
		const postResponse = await api
			.post("/api/blogs")
			.send(newBlog)
		expect(postResponse.statusCode).toBe(401)
	
		const getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		expect(getResponse.body).toHaveLength(initialBlogs.length)
	})
})

describe("blogs with no", () => {
	test("likes value have 0 likes", async () => {
		const newBlog = {
			title: "test4",
			author: "somebody else",
			url: "fake_url"
		}

		const response = await api.post("/api/blogs")
			.set("Authorization", token)
			.send(newBlog)
		expect(response.body.likes).toBeDefined()
		expect(response.body.likes).toBe(0)
	})

	test("title or url get rejected", async () => {
		const blogWithNoUrl = {
			title: "hello",
			author: "who knows",
			likes: 2
		}

		let response = await api.post("/api/blogs").send(blogWithNoUrl)
		expect(response.statusCode).toBe(400)

		const blogWithNoTitle = {
			author: "who knows",
			url: "www.google.com",
			likes: 2
		}

		response = await api.post("/api/blogs").send(blogWithNoTitle)
		expect(response.statusCode).toBe(400)
	})

})
describe("deleting blog", () => {
	test("with correct id works", async () => {
		let getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		const deletedBlog = getResponse.body[0]

		const deleteResponse = await api
			.delete(`/api/blogs/${deletedBlog.id}`)
			.set("Authorization", token)
		expect(deleteResponse.statusCode).toBe(204)

		getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		expect(getResponse.body).toHaveLength(initialBlogs.length - 1)
	})

	test("with incorrectly formatted id returns internal server error", async () => {
		const deleteResponse = await api.delete("/api/blogs/123")
		expect(deleteResponse.statusCode).toBe(500)

		const getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		expect(getResponse.body).toHaveLength(initialBlogs.length)
	})

	test("with correctly formatted but nonexisting id returns error message", async () => {
		const deleteResponse = await api.delete("/api/blogs/123456789012345678901234")
		expect(deleteResponse.statusCode).toBe(400)
		expect(deleteResponse.body).toEqual({ "error": "Invalid id" })

		const getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		expect(getResponse.body).toHaveLength(initialBlogs.length)
	})
})

describe("updating blog", () => {
	test("with correct id works", async () => {
		let getResponse = await api.get("/api/blogs")
		expect(getResponse.statusCode).toBe(200)
		let updatedBlog = getResponse.body[0]

		updatedBlog.title = "updateTest"
		updatedBlog.likes = updatedBlog.likes + 5

		const response = await api.put(`/api/blogs/${updatedBlog.id}`)
			.set("authorization", token)
			.send(updatedBlog)
		expect(response.statusCode).toBe(204)
	})
	test("with incorrectly formatted id returns internal server error", async () => {
		const putResponse = await api.put("/api/blogs/123")
		expect(putResponse.statusCode).toBe(500)
	})

	test("with correctly formatted but nonexisting id returns error message", async () => {
		const putResponse = await api.put("/api/blogs/123456789012345678901234")
		expect(putResponse.statusCode).toBe(400)
		expect(putResponse.body).toEqual({ "error": "Invalid id" })
	})
})


afterAll(async () => {
	await mongoose.connection.close()
})