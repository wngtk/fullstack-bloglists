const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)