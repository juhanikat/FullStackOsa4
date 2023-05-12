const jwt = require("jsonwebtoken")
const User = require("./models/user.js")


const tokenExtractor = (request, response, next) => { 
	const authorization = request.get("Authorization")
	if (authorization && authorization.startsWith("Bearer ")) {  
		request.body.token = authorization.replace("Bearer ", "")
		console.log("replaced")
	} else {
		request.body.token = null
	}
	next()
}

const userExtractor = async (request, response, next) => {
	let decodedToken = null
	try {
		decodedToken = jwt.verify(request.body.token, process.env.SECRET) 
	} catch(error) {
		console.log(error)
		decodedToken = null
	}

	if (decodedToken && decodedToken.id) {
		const user = await User.findById(decodedToken.id)
		request.body.user = user
	} else {
		request.body.user = null
	}
	next()
}

module.exports = {tokenExtractor, userExtractor}