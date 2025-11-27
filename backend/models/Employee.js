const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    date_of_joining: { type: Date},
    department: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    profilePicture: {
        type: String, // will store the URL path to the image
    },
});

module.exports = mongoose.model('Employee', employeeSchema);