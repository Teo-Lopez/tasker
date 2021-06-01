const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

router.post('/login', (req, res, next) => {
	const { email, password } = req.body

	if (!email || !password) {
		res.status(400).json({ message: 'Error. Comprueba que tus datos sean correctos.' })
		return
	}
	const regex = new RegExp(`${email}`, 'i')
	User.findOne({ email: regex })
		.lean()
		.then(foundUser => {
			if (!foundUser) {
				res.status(400).json({ message: 'Usuario no registrado.' })
				return
			}

			if (!bcrypt.compareSync(password, foundUser.password)) {
				res.status(400).json({ message: 'Contraseña incorrecta.' })
				return
			}

			req.session.user = foundUser
			res.json(foundUser)
		})
		.catch(err => next(err))
})

router.post('/logout', (req, res, next) => {
	req.session.destroy()
	res.status(200).json({ message: 'Log out success!' })
})

router.get('/loggedin', (req, res) => {
	if (req.session) {
		res.status(200).json(req.session.user)
	} else {
		res.status(403).json({ message: 'Unauthorized' })
	}
})

router.post('/signup', (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		res.status(400).json({ message: 'Proporcione un nombre y contraseña' })
		return
	}

	User.findOne({ email })
		.then(foundUser => {
			if (foundUser) {
				res.status(400).json({ message: 'Usuario ya existente. Elija otro' })
				return
			} else {
				const hash = bcrypt.hashSync(password, 10)
				console.log(hash)
				return User.create({
					password: hash,
					email
				})
			}
		})
		.then(userCreated => {
			req.session.user = userCreated
			res.status(200).json(userCreated)
		})
		.catch(err => res.status(400).json({ message: 'Saving user to database went wrong.', err }))
})

router.put('/', (req, res, next) => {
	const { user } = req.body

	User.findByIdAndUpdate(user._id, { ...user }, { new: true })
		.then(foundUser => {
			req.session.user = foundUser
			res.json(foundUser)
		})
		.catch(err => next(err))
})

module.exports = router
