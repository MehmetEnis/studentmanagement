module.exports = {
    "up": "CREATE TABLE `course_students` (`course_id` int NOT NULL,`student_id` int NOT NULL,PRIMARY KEY (`course_id`,`student_id`),KEY `student_id` (`student_id`),CONSTRAINT `course_students_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),CONSTRAINT `course_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
    "down": "DROP TABLE course_students"
}