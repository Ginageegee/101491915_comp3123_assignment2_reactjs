// Import Employee Model
const Employee = require('../models/Employee');

// GET all employees
exports.getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    res.status(200).json(employees);
};

// POST create employee
exports.createEmployee = async (req, res) => {
    const employee = await Employee.create(req.body);
    res.status(201).json({ message: 'Employee created successfully.', employee_id: employee._id });
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.eid);
    res.status(200).json(employee);
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.eid, req.body);
    res.status(200).json({ message: 'Employee details updated successfully.' });
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
    await Employee.findByIdAndDelete(req.query.eid);
    res.status(204).json({ message: 'Employee deleted successfully.' });
};
