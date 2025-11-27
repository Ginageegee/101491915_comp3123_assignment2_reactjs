// Import Employee Model
const Employee = require('../models/Employee');

// GET all employees (already updated for search – keep that version)
exports.getAllEmployees = async (req, res) => {
    try {
        const { department, position } = req.query;
        const filter = {};
        if (department) filter.department = { $regex: department, $options: 'i' };
        if (position) filter.position = { $regex: position, $options: 'i' };

        const employees = await Employee.find(filter);
        res.status(200).json(employees);
    } catch (err) {
        console.error('getAllEmployees error:', err);
        res.status(500).json({ message: 'Error fetching employees' });
    }
};

// POST create employee
exports.createEmployee = async (req, res) => {
    try {
        const data = { ...req.body };

        // if file uploaded, store its URL/path
        if (req.file) {
            data.profilePicture = `/uploads/${req.file.filename}`;
        }

        const employee = await Employee.create(data);
        res.status(201).json({
            message: 'Employee created successfully.',
            employee_id: employee._id,
        });
    } catch (err) {
        console.error('createEmployee error:', err);
        res.status(500).json({ message: 'Error creating employee' });
    }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.eid);
    res.status(200).json(employee);
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
    try {
        const updates = { ...req.body };

        if (req.file) {
            updates.profilePicture = `/uploads/${req.file.filename}`;
        }

        await Employee.findByIdAndUpdate(req.params.eid, updates);
        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (err) {
        console.error('updateEmployee error:', err);
        res.status(500).json({ message: 'Error updating employee' });
    }
};

// DELETE employee (unchanged)
exports.deleteEmployee = async (req, res) => {
    await Employee.findByIdAndDelete(req.query.eid);
    res.status(204).json({ message: 'Employee deleted successfully.' });
};
