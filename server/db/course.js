module.exports = function(db, connection){

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

}