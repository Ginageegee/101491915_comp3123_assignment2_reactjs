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

    // ADD EMPLOYEE MODAL (your existing stuff)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        salary: "",
    });

    // EDIT EMPLOYEE MODAL (already implemented)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState({
        _id: "",
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        salary: "",
    });

    // 🔹 PROFILE MODAL (NEW)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileEmployee, setProfileEmployee] = useState(null);
    const [profileFile, setProfileFile] = useState(null);

    // FETCH employees
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees", department, position],
        queryFn: () => employeeApi.getEmployees({ department, position }),
    });

    // CREATE, UPDATE, DELETE mutations (reuse your existing ones)
    const addEmployeeMutation = useMutation({
        mutationFn: employeeApi.createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsAddModalOpen(false);
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
    });

    const updateEmployeeMutation = useMutation({
        mutationFn: ({ id, data }) => employeeApi.updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsEditModalOpen(false);
            alert("Employee updated successfully");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: employeeApi.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            alert("Employee deleted");
        },
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const payload = { ...newEmployee, salary: Number(newEmployee.salary) };
        addEmployeeMutation.mutate(payload);
    };

    // open edit modal
    const handleOpenEdit = (emp) => {
        setEditEmployee({
            _id: emp._id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            department: emp.department,
            position: emp.position,
            salary: emp.salary,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const { _id, ...data } = editEmployee;
        const payload = { ...data, salary: Number(data.salary) };
        updateEmployeeMutation.mutate({ id: _id, data: payload });
    };

    // 🔹 open profile modal (NEW)
    const handleOpenProfile = (emp) => {
        setProfileEmployee(emp);
        setProfileFile(null);
        setIsProfileModalOpen(true);
    };

    // 🔹 submit profile picture + details (NEW)
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (!profileEmployee) return;

        const formData = new FormData();
        formData.append("first_name", profileEmployee.first_name);
        formData.append("last_name", profileEmployee.last_name);
        formData.append("email", profileEmployee.email);
        formData.append("department", profileEmployee.department);
        formData.append("position", profileEmployee.position);
        formData.append("salary", profileEmployee.salary);

        if (profileFile) {
            formData.append("profilePicture", profileFile);
        }

        updateEmployeeMutation.mutate({
            id: profileEmployee._id,
            data: formData,
        });

        setIsProfileModalOpen(false);
    };

    if (isLoading) return <h2>Loading employees...</h2>;

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>Employee List</h2>

            {/* SEARCH FILTER */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <input
                    placeholder="Filter by department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
                <input
                    placeholder="Filter by position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />
                <button onClick={() => queryClient.invalidateQueries(["employees"])}>
                    Search
                </button>
            </div>

            {/* ADD EMPLOYEE BUTTON */}
            <button onClick={() => setIsAddModalOpen(true)}>+ Add Employee</button>

            {/* EMPLOYEE TABLE */}
            <table
                style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
            >
                <thead>
                <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Salary</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.length > 0 ? (
                    employees.map((emp) => (
                        <tr key={emp._id} style={{ borderBottom: "1px solid #ccc" }}>
                            <td>{emp.first_name}</td>
                            <td>{emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department}</td>
                            <td>{emp.position}</td>
                            <td>{emp.salary}</td>
                            <td>
                                {/* NEW: View button */}
                                <button
                                    style={{ marginRight: "8px" }}
                                    onClick={() => handleOpenProfile(emp)}
                                >
                                    View
                                </button>

                                <button
                                    style={{
                                        marginRight: "8px",
                                        backgroundColor: "orange",
                                        color: "white",
                                    }}
                                    onClick={() => handleOpenEdit(emp)}
                                >
                                    Edit
                                </button>

                                <button
                                    style={{
                                        backgroundColor: "red",
                                        color: "white",
                                    }}
                                    onClick={() => deleteMutation.mutate(emp._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                            No employees found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* existing ADD + EDIT modals (keep your versions) */}
            {/* ... (your add/edit modals stay as before) ... */}

            {/* 🔹 PROFILE MODAL – VIEW + UPLOAD PICTURE */}
            <Modal
                isOpen={isProfileModalOpen}
                onRequestClose={() => setIsProfileModalOpen(false)}
                style={{ content: { width: "400px", margin: "auto" } }}
            >
                {profileEmployee && (
                    <>
                        <h3>Employee Profile</h3>
                        {/* show picture if exists */}
                        {profileEmployee.profilePicture && (
                            <img
                                src={`http://localhost:3001${profileEmployee.profilePicture}`}
                                alt="Profile"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    marginBottom: "1rem",
                                }}
                            />
                        )}
                        <p><strong>Name:</strong> {profileEmployee.first_name} {profileEmployee.last_name}</p>
                        <p><strong>Email:</strong> {profileEmployee.email}</p>
                        <p><strong>Department:</strong> {profileEmployee.department}</p>
                        <p><strong>Position:</strong> {profileEmployee.position}</p>
                        <p><strong>Salary:</strong> {profileEmployee.salary}</p>

                        <form onSubmit={handleProfileSubmit} style={{ marginTop: "1rem" }}>
                            <label>Upload / Change Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfileFile(e.target.files[0] || null)}
                                style={{ display: "block", marginBottom: "1rem" }}
                            />
                            <button type="submit">Save Profile</button>
                        </form>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default EmployeeListPage;



