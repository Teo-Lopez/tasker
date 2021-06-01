const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
	email: { type: String, required: [true, 'Email needed'], unique: true, trim: true },
	password: {
		type: String,
		required: [true, 'Password needed']
	}
})

const User = mongoose.model('User', userSchema)
module.exports = User
