import http from "./http-base";

const getAll = () => {
  return http.get("/classes");
};

const get = (id) => {
  return http.get(`/classes/${id}`);
};

const create = (data) => {
  return http.post("/classes", data);
};

const update = (id, data) => {
  return http.put(`/classes/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/classes/${id}`);
};

const getAttendingStudents = (id) => {
  return http.get(`/classes/${id}/attendees`);
};

const getNotAttendingStudents = (id) => {
  return http.get(`/classes/${id}/notattending`);
};

const addAttendee = (class_id, student_id) => {
  return http.post(`/classes/${class_id}/${student_id}`);
};

const removeAttendee = (class_id, student_id) => {
  return http.delete(`/classes/${class_id}/${student_id}`);
};

const ClassService = {
  getAll,
  get,
  create,
  update,
  remove,
  getAttendingStudents,
  getNotAttendingStudents,
  addAttendee,
  removeAttendee
};

export default ClassService;
