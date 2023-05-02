const dummy = (_blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	var total = 0
	blogs.forEach(blog => {
		var likes = blog.likes || 0
		total = total + likes
	})
	return total
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}
	var mostLikedBlog = blogs[0]
	blogs.forEach(blog => {
		var likes = blog.likes || 0
		if (likes > mostLikedBlog.likes || 0) {
			mostLikedBlog = blog
		}
	})
	return mostLikedBlog
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}