// Import Employee Model
const Employee = require('../models/Employee');

// GET all employees
// GET all employees (with optional search by department / position)
exports.getAllEmployees = async (req, res) => {
    try {
        const { department, position } = req.query;

        const filter = {};

        if (department) {
            // case-insensitive match on department
            filter.department = { $regex: department, $options: 'i' };
        }

        if (position) {
            // case-insensitive match on position
            filter.position = { $regex: position, $options: 'i' };
        }

        const employees = await Employee.find(filter);
        res.status(200).json(employees);
    } catch (error) {
        console.error('getAllEmployees error:', error);
        res.status(500).json({ message: 'Error fetching employees' });
    }
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
