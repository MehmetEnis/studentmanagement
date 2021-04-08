module.exports = function(db, connection){

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

}