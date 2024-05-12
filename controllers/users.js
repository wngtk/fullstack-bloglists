const { Router } = require("express");
const User = require("../models/user");
const { hash } = require("bcrypt");

const usersRouter = Router()

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body    

    const saltRounds = 10;
    const passwordHash = await hash(password, saltRounds);
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    return response.json(users)
})

module.exports = usersRouter