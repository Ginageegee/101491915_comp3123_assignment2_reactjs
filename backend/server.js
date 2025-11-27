const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

const cors = require('cors');

const path = require('path');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware to parse JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Basic test route to confirm server is alive
app.get('/', (req, res) => {
    console.log('✅ Root route hit');
    res.send('Hello, Regina! Your server is running 🎉');
});

// ✅ Mount employee routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/v1/emp', employeeRoutes);

// ✅ Optional: Mount user routes if needed
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/user', userRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server is listening on port ${PORT}`);
});