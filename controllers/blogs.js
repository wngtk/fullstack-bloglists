const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    url: body.url,
    likes: body.likes ? body.likes : 0
  })

  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })
  //   .catch(err => {
  //     if (err.name === "ValidationError")
  //       return response.status(400).json({ error: error.message })
  //     next(err)
  //   })
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (err) {
    if (err.name === "ValidationError")
      return response.status(400).json({ error: error.message })
    next(err)
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
