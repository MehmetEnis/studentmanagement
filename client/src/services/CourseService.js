import http from "./http-base";

const getAll = () => {
  return http.get("/courses");
};

const get = (id) => {
  return http.get(`/courses/${id}`);
};

const create = (data) => {
  return http.post("/courses", data);
};

const update = (id, data) => {
  return http.put(`/courses/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/courses/${id}`);
};

const getAttendingStudents = (id) => {
  return http.get(`/courses/${id}/attendees`);
};

const removeAttendee = (course_id, student_id) => {
  return http.delete(`/courses/${course_id}/${student_id}`);
};

const addAttendee = (class_id, student_id) => {
  return http.post(`/courses/${class_id}/${student_id}`);
};

const CourseService = {
  getAll,
  get,
  create,
  update,
  remove,
  getAttendingStudents,
  removeAttendee,
  addAttendee
};

export default CourseService;
