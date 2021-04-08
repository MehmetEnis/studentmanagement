module.exports = {
    "up": "INSERT INTO students (`name`, `surname`, `dateofbirth`) VALUES ('Mehmet', 'Inonu', '1990-06-07')",
    "down": "DELETE FROM students WHERE (`name` = 'Mehmet')"
}