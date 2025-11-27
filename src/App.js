import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmployeeListPage from './pages/EmployeeListPage';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <EmployeeListPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </>
    );
}

export default App;
