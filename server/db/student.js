module.exports = function(db, connection){

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
    
}