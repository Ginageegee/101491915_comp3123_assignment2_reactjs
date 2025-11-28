// src/pages/EmployeeListPage.js
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import employeeApi from "../api/employeeApi";
import Modal from "react-modal";

Modal.setAppElement("#root");

function EmployeeListPage() {
    const queryClient = useQueryClient();

    // SEARCH FILTER STATES
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");

    // ADD EMPLOYEE MODAL
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        salary: "",
    });
    const [newEmployeeFile, setNewEmployeeFile] = useState(null);

    // EDIT EMPLOYEE MODAL
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState({
        _id: "",
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        salary: "",
        profilePicture: "",
    });
    const [editEmployeeFile, setEditEmployeeFile] = useState(null);

    // VIEW EMPLOYEE MODAL
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewEmployee, setViewEmployee] = useState(null);

    // ================== QUERIES ==================
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees", department, position],
        queryFn: () => employeeApi.getEmployees({ department, position }),
    });

    // ================== MUTATIONS ==================
    const addEmployeeMutation = useMutation({
        mutationFn: employeeApi.createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsAddModalOpen(false);
            setNewEmployeeFile(null);
            setNewEmployee({
                first_name: "",
                last_name: "",
                email: "",
                department: "",
                position: "",
                salary: "",
            });
            alert("Employee added successfully");
        },
        onError: (err) => {
            console.error("ADD ERROR:", err.response?.data || err);
            alert("Failed to add employee");
        },
    });

    const deleteEmployeeMutation = useMutation({
        mutationFn: employeeApi.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            alert("Employee deleted");
        },
        onError: (err) => {
            console.error("DELETE ERROR:", err.response?.data || err);
            alert("Failed to delete employee");
        },
    });

    const updateEmployeeMutation = useMutation({
        mutationFn: ({ id, data }) => employeeApi.updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsEditModalOpen(false);
            setEditEmployeeFile(null);
            alert("Employee updated successfully");
        },
        onError: (err) => {
            console.error("UPDATE ERROR:", err.response?.data || err);
            alert("Failed to update employee");
        },
    });

    // ================== HANDLERS ==================
    const handleSearch = () => {
        queryClient.invalidateQueries(["employees"]);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();

        // Build FormData so we can send text + file
        const formData = new FormData();
        Object.entries(newEmployee).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        if (newEmployeeFile) {
            formData.append("profilePicture", newEmployeeFile);
        }

        addEmployeeMutation.mutate(formData);
    };

    const handleOpenEdit = (emp) => {
        setEditEmployee({
            _id: emp._id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            department: emp.department,
            position: emp.position,
            salary: emp.salary ?? "",
            profilePicture: emp.profilePicture ?? "",
        });
        setEditEmployeeFile(null);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (field, value) => {
        setEditEmployee((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const { _id, ...data } = editEmployee;

        // If user picked a new file → use FormData
        if (editEmployeeFile) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            formData.append("profilePicture", editEmployeeFile);

            updateEmployeeMutation.mutate({
                id: _id,
                data: formData,
            });
        } else {
            // No new file → plain JSON update
            if (data.salary !== "" && data.salary !== undefined) {
                data.salary = Number(data.salary);
            }
            updateEmployeeMutation.mutate({
                id: _id,
                data,
            });
        }
    };

    const handleOpenView = (emp) => {
        setViewEmployee(emp);
        setIsViewModalOpen(true);
    };

    const getProfilePicUrl = (emp) => {
        if (!emp?.profilePicture) return null;

        const value = emp.profilePicture;
        if (value.startsWith("http")) return value;

        return `http://localhost:3001${
            value.startsWith("/") ? value : `/uploads/${value}`
        }`;
    };

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                    color: "#555",
                }}
            >
                Loading employees...
            </div>
        );
    }

    // Reusable small style helpers
    const inputStyle = {
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        flex: 1,
        fontSize: "0.9rem",
    };

    const primaryButtonStyle = {
        backgroundColor: "#646cff",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.9rem",
    };

    const dangerButtonStyle = {
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
    };

    const secondaryButtonStyle = {
        backgroundColor: "#f1f1f5",
        color: "#333",
        border: "1px solid #ccc",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
    };

    // ================== RENDER ==================
    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "2rem auto",
                padding: "1.5rem 2rem",
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>Employee Management</h2>
                    <p style={{ margin: "4px 0 0", color: "#666", fontSize: "0.9rem" }}>
                        View, add, edit, delete employees and manage profiles.
                    </p>
                </div>

                {/* ADD EMPLOYEE BUTTON */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                    onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                    + Add Employee
                </button>
            </div>

            {/* SEARCH FILTER */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "1rem",
                    padding: "10px 12px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e2e2e8",
                }}
            >
                <input
                    placeholder="Filter by department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={inputStyle}
                />
                <input
                    placeholder="Filter by position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    style={inputStyle}
                />
                <button
                    onClick={handleSearch}
                    style={primaryButtonStyle}
                    onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                    onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                    Search
                </button>
            </div>

            {/* EMPLOYEE TABLE */}
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e2e2e8",
                    overflow: "hidden",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                    <tr style={{ backgroundColor: "#f3f4ff" }}>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>First Name</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Last Name</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Email</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Department</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Position</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Salary</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "0.85rem" }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.length > 0 ? (
                        employees.map((emp, index) => (
                            <tr
                                key={emp._id}
                                style={{
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: index % 2 === 0 ? "#fff" : "#fafbff",
                                }}
                            >
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.first_name}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.last_name}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.email}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.department}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.position}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>{emp.salary}</td>
                                <td style={{ padding: "10px", fontSize: "0.9rem" }}>
                                    <button
                                        style={{ ...secondaryButtonStyle, marginRight: "6px" }}
                                        onClick={() => handleOpenView(emp)}
                                    >
                                        View
                                    </button>
                                    <button
                                        style={{ ...secondaryButtonStyle, marginRight: "6px" }}
                                        onClick={() => handleOpenEdit(emp)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={dangerButtonStyle}
                                        onClick={() => deleteEmployeeMutation.mutate(emp._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "20px", fontSize: "0.9rem" }}>
                                No employees found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ADD EMPLOYEE MODAL */}
            <Modal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                style={{
                    content: {
                        width: "420px",
                        maxWidth: "90%",
                        margin: "auto",
                        borderRadius: "12px",
                        padding: "20px 24px",
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.4)",
                    },
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Add Employee</h3>
                <form onSubmit={handleAddSubmit}>
                    <input
                        placeholder="First Name"
                        value={newEmployee.first_name}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, first_name: e.target.value })
                        }
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Last Name"
                        value={newEmployee.last_name}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, last_name: e.target.value })
                        }
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, email: e.target.value })
                        }
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Department"
                        value={newEmployee.department}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, department: e.target.value })
                        }
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Position"
                        value={newEmployee.position}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, position: e.target.value })
                        }
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Salary"
                        type="number"
                        value={newEmployee.salary}
                        onChange={(e) =>
                            setNewEmployee({ ...newEmployee, salary: e.target.value })
                        }
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />

                    {/* File input for profile picture */}
                    <div style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewEmployeeFile(e.target.files[0] || null)}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                            type="button"
                            style={secondaryButtonStyle}
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={primaryButtonStyle}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            {/* EDIT EMPLOYEE MODAL */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                style={{
                    content: {
                        width: "420px",
                        maxWidth: "90%",
                        margin: "auto",
                        borderRadius: "12px",
                        padding: "20px 24px",
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.4)",
                    },
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Edit Employee</h3>

                {/* Show current picture if exists */}
                {editEmployee.profilePicture && (
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <img
                            src={getProfilePicUrl(editEmployee)}
                            alt="Current profile"
                            style={{ maxWidth: "120px", borderRadius: "50%" }}
                        />
                    </div>
                )}

                <form onSubmit={handleEditSubmit}>
                    <input
                        placeholder="First Name"
                        value={editEmployee.first_name}
                        onChange={(e) => handleEditChange("first_name", e.target.value)}
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Last Name"
                        value={editEmployee.last_name}
                        onChange={(e) => handleEditChange("last_name", e.target.value)}
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={editEmployee.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        required
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Department"
                        value={editEmployee.department}
                        onChange={(e) => handleEditChange("department", e.target.value)}
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Position"
                        value={editEmployee.position}
                        onChange={(e) => handleEditChange("position", e.target.value)}
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        placeholder="Salary"
                        type="number"
                        value={editEmployee.salary}
                        onChange={(e) => handleEditChange("salary", e.target.value)}
                        style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
                    />

                    {/* New picture upload */}
                    <div style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>
                            Change Profile Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setEditEmployeeFile(e.target.files[0] || null)
                            }
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                            type="button"
                            style={secondaryButtonStyle}
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={primaryButtonStyle}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* VIEW EMPLOYEE MODAL */}
            <Modal
                isOpen={isViewModalOpen}
                onRequestClose={() => setIsViewModalOpen(false)}
                style={{
                    content: {
                        width: "420px",
                        maxWidth: "90%",
                        margin: "auto",
                        borderRadius: "12px",
                        padding: "20px 24px",
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.4)",
                    },
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Employee Details</h3>
                {viewEmployee && (
                    <div>
                        {getProfilePicUrl(viewEmployee) && (
                            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                <img
                                    src={getProfilePicUrl(viewEmployee)}
                                    alt="Profile"
                                    style={{ maxWidth: "150px", borderRadius: "50%" }}
                                />
                            </div>
                        )}
                        <p><strong>First Name:</strong> {viewEmployee.first_name}</p>
                        <p><strong>Last Name:</strong> {viewEmployee.last_name}</p>
                        <p><strong>Email:</strong> {viewEmployee.email}</p>
                        <p><strong>Department:</strong> {viewEmployee.department}</p>
                        <p><strong>Position:</strong> {viewEmployee.position}</p>
                        <p><strong>Salary:</strong> {viewEmployee.salary}</p>
                    </div>
                )}
                <div style={{ textAlign: "right", marginTop: "12px" }}>
                    <button
                        style={secondaryButtonStyle}
                        onClick={() => setIsViewModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default EmployeeListPage;

