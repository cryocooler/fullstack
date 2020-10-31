const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blog => {
          response.json(blog)
      })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
      .save()
      .then(result => {
          response.status(201).json(result)
      })
      .catch(error => next(error))
})

module.exports = blogsRouter