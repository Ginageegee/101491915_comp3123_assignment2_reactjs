// backend/server.js
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

connectDB();

//Serve uploaded images from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Parse JSON bodies
app.use(express.json());

//Test route
app.get('/', (req, res) => {
    res.send('Your server is running ');
});

//Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/v1/emp', employeeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/user', userRoutes);

//Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server is listening on port ${PORT}`);
});