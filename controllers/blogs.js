const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    url: body.url,
    likes: body.likes ? body.likes : 0
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

module.exports = blogsRouter
