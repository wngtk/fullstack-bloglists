const { beforeEach, after, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    console.log(blogs)
    return blogs.map(r => r.toJSON())
}

beforeEach(async () => {
    await Blog.deleteMany({})


    const blogs = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())

    // await all promise be fulfilled
    await Promise.all(promiseArray)
})

test('bloglists are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a specific note can be viewed', async () => {
    const blogs = await blogsInDb()
    const blogToView = blogs[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
})

after(async () => {
    await mongoose.connection.close()
})
