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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        salary: "",      // 👈 backend expects salary too
    });

    // Fetch Employees ==============================
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees", department, position],
        queryFn: () => employeeApi.getEmployees({ department, position }),
    });

    // Create Employee ==============================
    const addEmployeeMutation = useMutation({
        mutationFn: employeeApi.createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            setIsModalOpen(false);
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
            console.log("ADD EMPLOYEE ERROR:", err.response?.status, err.response?.data);
            alert("Failed to add employee. Check console for details.");
        },
    });

    // Delete Employee ==============================
    const deleteMutation = useMutation({
        mutationFn: employeeApi.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
            alert("Employee deleted");
        },
        onError: (err) => {
            console.log("DELETE EMPLOYEE ERROR:", err.response?.status, err.response?.data);
            alert("Failed to delete employee. Check console for details.");
        },
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();

        // ensure salary is a number
        const payload = {
            ...newEmployee,
            salary: Number(newEmployee.salary),
        };

        addEmployeeMutation.mutate(payload);
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
            <button onClick={() => setIsModalOpen(true)}>+ Add Employee</button>

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
                                <button
                                    style={{
                                        marginRight: "10px",
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

            {/* ADD EMPLOYEE MODAL */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{ content: { width: "400px", margin: "auto" } }}
            >
                <h3>Add Employee</h3>
                <form onSubmit={handleAddSubmit}>
                    {Object.keys(newEmployee).map((field) => (
                        <input
                            key={field}
                            placeholder={field}
                            type={field === "salary" ? "number" : "text"}
                            value={newEmployee[field]}
                            onChange={(e) =>
                                setNewEmployee({ ...newEmployee, [field]: e.target.value })
                            }
                            required
                            style={{ display: "block", width: "100%", marginBottom: "10px" }}
                        />
                    ))}
                    <button type="submit">Save</button>
                </form>
            </Modal>
        </div>
    );
}

export default EmployeeListPage;
