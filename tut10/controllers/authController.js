const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	},
}

const path = require('path')
const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body
	if (!user || !pwd) {
		return res
			.status(400)
			.json({ message: 'Username and password are required.' })
	}
	const foundUser = usersDB.users.find((p) => p.username === user)
	if (!foundUser) return res.sendStatus(401)
	//check password
	const match = await bcrypt.compare(pwd, foundUser.password)
	if (match) {
		//create JWTs
		res.json({ message: `User ${user} logged` })
	} else {
		res.sendStatus(401)
	}
}

module.exports = { handleLogin }
