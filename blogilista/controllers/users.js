const express = require("express")
const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
usersRouter.use(express.json())
const User = require("../models/user")


usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1, likes: 1, id: 1})
	response.json(users)
})

usersRouter.post("/", async (request, response) => {
	const username = request.body.username || false
	const name = request.body.name
	const password = request.body.password || false

	if (!(username && password) || username.length < 3 || password.length < 3) {
		response.status(400).send({error: "no username or password or username/password length is under 3"})
		return
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const alreadyExists = await User.findOne({ username: user.username })
	if (alreadyExists) {
		response.status(400).send({error: "username already exists"})
		return
	}

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

module.exports = usersRouter