const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500

//custom middleware logger
app.use(logger)

//Cross Origin Resource Sharing
const whitelist = ['http://localhost:3500', 'https://google.com/']
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

//NOTE built-in middlewares

//middleware to handle urlencoded data
//'content-type: application/x-www.form-urlencoded'
app.use(express.urlencoded({ extended: false }))

//middleware for json
app.use(express.json())

//middleware to serve static files
app.use(express.static(path.join(__dirname, '/public')))

app.get('^/$|/index(.html)?', (req, res) => {
	// res.sendFile('./views/index.html', {root: __dirname})
	res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page.html')
})

//Route handlers

app.get('/hello(.html)?', (req, res, next) => {
	console.log('attempted to load hello.html')
	//it goes to the next handler
	next()
})

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

app.listen(PORT, () =>
	console.log(`Server running on port ${PORT} \n http://localhost:${PORT}/`)
)
