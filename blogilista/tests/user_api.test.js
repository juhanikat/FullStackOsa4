const express = require("express")
const User = require("../models/user.js")
const supertest = require("supertest")
const app = require("../app.js")
const bcrypt = require("bcrypt")
app.use(express.json())

const api = supertest(app)

describe("adding user", () => {
	beforeEach(async () => {
		await User.deleteMany({})
    
		const passwordHash = await bcrypt.hash("supertest", 10)
		const user = new User({username:"supertest", passwordHash: passwordHash})
        
		await user.save()
	})
    
	test("with no username or password doesn't work", async() => {
		let newUser = {
			name:"hello",
			password:"abcde"
		}
		let response = await api.post("/api/users").send(newUser)
		expect(response.statusCode).toBe(400)
		expect(response.body.error).toEqual("no username or password or username/password length is under 3")

		newUser = {
			username: "abcde",
			name:"hello"
		}
		response = await api.post("/api/users").send(newUser)
		expect(response.statusCode).toBe(400)
		expect(response.body.error).toEqual("no username or password or username/password length is under 3")
	})
	
	test("with username shorter than 3 characters doesn't work", async() => {
		const newUser = {
			username: "ab",
			name:"hello",
			password:"abcde"
		}
		const response = await api.post("/api/users").send(newUser)
		expect(response.statusCode).toBe(400)
		expect(response.body.error).toEqual("no username or password or username/password length is under 3")
	})
    
	test("with password shorter than 3 characters doesn't work", async() => {
		const newUser = {
			username: "abcde",
			name:"hello",
			password:"ab"
		}
		const response = await api.post("/api/users").send(newUser)
		expect(response.statusCode).toBe(400)
		expect(response.body.error).toEqual("no username or password or username/password length is under 3")
	})
    
	test("with existing username doesn't work", async() => {
		const newUser = {
			username: "supertest",
			name:"hello",
			password:"abcde"
		}
		const response = await api.post("/api/users").send(newUser)
		expect(response.statusCode).toBe(400)
		expect(response.body.error).toEqual("username already exists")
	})
})