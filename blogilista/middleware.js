const tokenExtractor = (request, response, next) => { 
	const authorization = request.get("authorization")
	if (authorization && authorization.startsWith("Bearer ")) {  
		request.body.token = authorization.replace("Bearer ", "")
	} else {
		request.body.token = null
	}
	next()
}

module.exports = {tokenExtractor}