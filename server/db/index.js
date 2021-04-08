require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit:5,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

let db = {};

db.createStudent = (data) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO students (name, surname, dateofbirth) VALUES (?,?,?)', [data.name, data.surname, data.dateofbirth], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getAllStudents = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT id, name, surname, DATE_FORMAT(dateofbirth,\'%Y-%m-%d\') as dateofbirth, CONCAT(students.name, " ", students.surname) as displayName FROM students', (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getAllOpenStudents = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT students.id, name, surname, DATE_FORMAT(dateofbirth,\'%Y-%m-%d\') as dateofbirth, CONCAT(students.name, " ", students.surname) as displayName FROM students WHERE id NOT IN (SELECT student_id FROM class_students)', (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.findStudentById = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT id, name, surname, DATE_FORMAT(dateofbirth,\'%Y-%m-%d\') as dateofbirth, CONCAT(students.name, " ", students.surname) as displayName FROM students WHERE id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result[0]);
        })
    })
}

db.deleteStudent = (id) => {
    return new Promise((resolve,reject) => {
        connection.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('DELETE FROM course_students WHERE student_id = ?', id, function (error, result, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    connection.query('DELETE FROM class_students WHERE student_id = ?', id, function (error, result, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        connection.query('DELETE FROM students WHERE id = ?', id, function (error, result, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        throw err;
                                    });
                                }
                                return resolve(result);
                            });
                        })
                    });
                });
            });
        });
    })
}

db.updateStudent = (id, data) => {
    return new Promise((resolve,reject) => {
        connection.query('UPDATE students SET name = ?, surname = ?, dateofbirth = ? WHERE id = ?', [data.name, data.surname, data.dateofbirth, id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getStudentCourses = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT courses.id , courses.course_name, courses.credits FROM students '+
                         'JOIN course_students ON course_students.student_id = students.id '+
                         'JOIN courses ON course_students.course_id = courses.id '+
                         'WHERE students.id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getStudentClass = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT classes.id , classes.class_name, classes.department FROM students '+
                         'JOIN class_students ON class_students.student_id = students.id '+
                         'JOIN classes ON class_students.class_id = classes.id '+
                         'WHERE students.id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result[0]);
        })
    })
}

db.courses = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM courses', (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.createCourse = (data) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO courses (course_name, credits) VALUES (?,?)', [data.course_name, data.credits], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.findCourseById = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM courses WHERE id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result[0]);
        })
    })
}

db.updateCourse = (id, data) => {
    return new Promise((resolve,reject) => {
        connection.query('UPDATE courses SET course_name = ?, credits = ? WHERE id = ?', [data.course_name, data.credits, id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getCourseAttendees = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('select students.id, students.name, students.surname, CONCAT(students.name, " ", students.surname) as displayName from course_students '+
                         'JOIN courses ON course_students.course_id = courses.id '+
                         'JOIN students ON course_students.student_id = students.id '+
                         'WHERE course_id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.setCourseAttendee = (id, student_id) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO course_students (course_id, student_id) VALUES (?,?)', [id, student_id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.deleteCourseAttendee = (id, student_id) => {
    return new Promise((resolve,reject) => {
        connection.query('DELETE FROM course_students WHERE (course_id = ?) and (student_id = ?)', [id, student_id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.deleteCourse = (id) => {
    return new Promise((resolve,reject) => {
        connection.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('DELETE FROM course_students WHERE course_id = ?', id, function (error, result, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    connection.query('DELETE FROM courses WHERE id = ?', id, function (error, result, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            return resolve(result);
                        });
                    });
                });
            });
        });
    })
}

db.classes = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM classes', (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.createClass = (data) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO classes (class_name, department) VALUES (?,?)', [data.class_name, data.department], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.updateClass = (id, data) => {
    return new Promise((resolve,reject) => {
        connection.query('UPDATE classes SET class_name = ?, department = ? WHERE id = ?', [data.class_name, data.department, id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.deleteClass = (id) => {
    return new Promise((resolve,reject) => {
        connection.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('DELETE FROM class_students WHERE class_id = ?', id, function (error, result, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    connection.query('DELETE FROM classes WHERE id = ?', id, function (error, result, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            return resolve(result);
                        });
                    });
                });
            });
        });
    })
}

db.findClassById = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM classes WHERE id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result[0]);
        })
    })
}

db.getClassAttendees = (id) => {
    return new Promise((resolve,reject) => {
        connection.query('select students.id, students.name, students.surname, CONCAT(students.name, " ", students.surname) as displayName from class_students '+
                         'JOIN classes ON class_students.class_id = classes.id '+
                         'JOIN students ON class_students.student_id = students.id '+
                         'WHERE class_id = ?', [id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.setClassAttendee = (class_id, student_id) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO class_students (class_id, student_id) VALUES (?,?) ON DUPLICATE KEY UPDATE class_id = ?', [class_id, student_id, class_id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.deleteClassAttendee = (id, student_id) => {
    return new Promise((resolve,reject) => {
        connection.query('DELETE FROM class_students WHERE (class_id = ?) and (student_id = ?)', [id, student_id], (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

module.exports = db;
