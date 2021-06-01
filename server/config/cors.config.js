const cors = require('cors')

const whitelist = [process.env.DOMAIN, 'http://localhost:5000']

const corsOptions = {
	origin: (origin, cb) => {
		const originIsWhitelisted = whitelist.includes(origin)
		cb(null, originIsWhitelisted)
	},
	credentials: true
}

module.exports = app => app.use(cors(corsOptions))
