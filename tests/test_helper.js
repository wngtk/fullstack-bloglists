const { hash } = require("bcrypt")
const User = require("../models/user")

const rootUser = {
    "username": "root",
    "name": "root",
    "password": "123456"
}

const createRootUser = async () => {
    const passwordHash = await hash(rootUser.password, 10)
    const user = new User({username: rootUser.username, name: rootUser.name, passwordHash})
    await user.save(user)
}

const usersInDb = async () => {
    const users = await User.find({})    
    return users.map(u => u.toJSON())
}


module.exports = {
    createRootUser,
    usersInDb
}
