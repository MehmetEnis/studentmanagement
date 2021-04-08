module.exports = {
    "up": "INSERT INTO classes (`class_name`, `department`) VALUES ('Semester Fall', 'IT Dept')",
    "down": "DELETE FROM classes WHERE (`class_name` = 'Semester Fall')"
}