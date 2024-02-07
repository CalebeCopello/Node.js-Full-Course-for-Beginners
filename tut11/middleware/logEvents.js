const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (msg, logName) => {
	const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
	const logItem = `${dateTime}\t${uuid()}\t${msg}`
	try {
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
		}
		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', logName),
			logItem
		)
	} catch (err) {
		console.log(err)
	}
}

const logger = (req, res, next) => {
	logEvents(
		`Request Method: ${req.method}\tRequest Origin: ${req.headers.origin}\tRequest URL: ${req.url}\n`,
		'reqLog.txt'
	)
	next()
}

module.exports = { logger, logEvents }
