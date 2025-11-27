// src/api/employeeApi.js
import axiosClient from "./axiosClient";

const employeeApi = {
    getEmployees: (params) =>
        axiosClient.get("/emp/employees", { params }).then((res) => res.data),

    createEmployee: (data) =>
        axiosClient.post("/emp/employees", data).then((res) => res.data),

    // ✅ NEW: update employee
    updateEmployee: (id, data) =>
        axiosClient.put(`/emp/employees/${id}`, data).then((res) => res.data),

    deleteEmployee: (id) =>
        axiosClient.delete(`/emp/employees?eid=${id}`).then((res) => res.data),
};

export default employeeApi;