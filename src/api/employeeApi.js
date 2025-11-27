import axiosClient from "./axiosClient";

const employeeApi = {
    getEmployees: (params) =>
        axiosClient.get("/emp/employees", { params }).then((res) => res.data),

    createEmployee: (data) =>
        axiosClient.post("/emp/employees", data).then((res) => res.data),

    getEmployeeById: (id) =>
        axiosClient.get(`/emp/employees/${id}`).then((res) => res.data),


    updateEmployee: (id, data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
        }
        return axiosClient.put(`/emp/employees/${id}`, data, config).then((res) => res.data);
    },

    deleteEmployee: (id) =>
        axiosClient.delete(`/emp/employees?eid=${id}`).then((res) => res.data),
};

export default employeeApi;
