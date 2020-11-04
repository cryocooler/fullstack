const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })

    if (blog.likes === undefined) {
        blog.likes = 0
    }
    
    if (blog.title === undefined && blog.url === undefined) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    if (blog.likes === undefined) {
        blog.likes = 0
    }

    if (blog.title === (undefined || '') && blog.url === (undefined || '')) {
        response.status(400).end()
    } else {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
        response.json(updatedBlog.toJSON())
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter