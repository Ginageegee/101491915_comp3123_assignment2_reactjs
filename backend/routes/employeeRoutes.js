const express = require('express');
const router = express.Router();

const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

// 👇 add this
const upload = require('../config/upload');

// requests
router.get('/employees', getAllEmployees);

// for create / update allow 1 file with field name 'profilePicture'
router.post('/employees', upload.single('profilePicture'), createEmployee);
router.get('/employees/:eid', getEmployeeById);
router.put('/employees/:eid', upload.single('profilePicture'), updateEmployee);

// delete still uses ?eid=
router.delete('/employees', deleteEmployee);

module.exports = router;
