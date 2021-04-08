import http from "./http-base";

const getAllStudents = () => {
  return http.get("/students");
};

const getAllOpenStudents = () => {
  return http.get("/students/oprhaned");
};

const get = (id) => {
  return http.get(`/students/${id}`);
};

const create = (data) => {
  return http.post("/students", data);
};

const update = (id, data) => {
  return http.put(`/students/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/students/${id}`);
};

const getCourses = (id) => {
  return http.get(`/students/${id}/courses`);
};

const getClass = (id) => {
  return http.get(`/students/${id}/class`);
};

const StudentService = {
  getAllStudents,
  getAllOpenStudents,
  get,
  create,
  update,
  remove,
  getCourses,
  getClass
};

export default StudentService;
