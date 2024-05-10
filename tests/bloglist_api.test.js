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

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length + 1)     

    const bloglists = blogListsAtEnd.map(r => r.title)
    assert(bloglists.includes('The Principle of Least Power'))
})

test('blog without likes can be added with default likes 0', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
    }

    const resultBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    assert.strictEqual(resultBlog.body.likes, 0)

})

test('bloglist without title is not added', async () => {
    const newBlog = {
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length)
})

test('bloglist without url is not added', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})
