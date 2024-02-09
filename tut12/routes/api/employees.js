const express = require('express')
const router = express.Router()
const data = {}
data.employees = require('../../model/employees.json')
const employeesController = require('../../controllers/employeesController')
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router
	.route('/')
	.get(employeesController.getAllEmployees)
	.post(verifyRoles(rolesList.Admin, rolesList.Editor), employeesController.createNewEmployee)
	.put(verifyRoles(rolesList.Admin, rolesList.Editor),employeesController.updateEmployee)
	.delete(verifyRoles(rolesList.Admin),employeesController.deleteEmployee)

router.route('/:id').get(employeesController.getEmployee)

module.exports = router
