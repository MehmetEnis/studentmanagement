module.exports = {
    "up": "INSERT INTO courses (`course_name`, `credits`) VALUES ('React 101', '60')",
    "down": "DELETE FROM courses WHERE (`course_name` = 'React 101')"
}