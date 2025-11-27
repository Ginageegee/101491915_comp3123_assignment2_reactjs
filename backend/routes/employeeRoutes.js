const express = require('express');
const router = express.Router();

const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');


const upload = require('../config/upload');

// requests
router.get('/employees', getAllEmployees);

router.post('/employees', upload.single('profilePicture'), createEmployee);

router.get('/employees/:eid', getEmployeeById);

router.put('/employees/:eid', upload.single('profilePicture'), updateEmployee);

router.delete('/employees', deleteEmployee);

module.exports = router;
