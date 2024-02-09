require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

//Conect to MongoDB
connectDB()

//custom middleware logger
app.use(logger)

//Cross Origin Resource Sharing
app.use(cors(corsOptions))

//'content-type: application/x-www.form-urlencoded'
app.use(express.urlencoded({ extended: false }))

//middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//middleware to serve static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use('/subdir', require('./routes/subdir'))
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

app.all('/*', (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'))
	} else if (req.accepts('json')) {
		res.json({ error: '404 Not Found!!' })
	} else {
		res.type('txt').send('404 Not Found')
	}
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log('Connect to MongoDB')
	app.listen(PORT, () =>
		console.log(`Server running on port ${PORT} \n http://localhost:${PORT}/`)
	)
})
