const dummy = (_blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	var total = 0
	blogs.forEach(blog => {
		var likes = blog.likes
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
		var likes = blog.likes
		if (likes > mostLikedBlog.likes || 0) {
			mostLikedBlog = blog
		}
	})
	return mostLikedBlog
}

const mostLikes = (blogs) => {
	const authors = {}
	blogs.forEach(blog => {
		if (!(authors[blog.author])) {
			authors[blog.author] = 0
		}
		authors[blog.author] += blog.likes
	})
	let mostLiked = Object.keys(authors)[0]
	Object.keys(authors).forEach(author => {
		if (authors[author] > authors[mostLiked]) {
			mostLiked = author
		}
	})
	return mostLiked
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostLikes
}