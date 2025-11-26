import axiosClient from './axiosClient';

const employeeApi = {
    getAll: (filters = {}) =>
        axiosClient
            .get('/emp/employees', { params: filters })
            .then((res) => res.data),

    create: (payload) => axiosClient.post('/emp/employees', payload),
    getById: (id) => axiosClient.get(`/emp/employees/${id}`).then(r => r.data),
    update: (id, payload) => axiosClient.put(`/emp/employees/${id}`, payload),
    remove: (id) => axiosClient.delete(`/emp/employees`, { params: { eid: id } }),
};

export default employeeApi;
