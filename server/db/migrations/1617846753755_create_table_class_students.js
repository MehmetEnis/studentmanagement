module.exports = {
    "up": "CREATE TABLE `class_students` (`student_id` int NOT NULL,`class_id` int NOT NULL,PRIMARY KEY (`student_id`),KEY `class_id_idx` (`class_id`),CONSTRAINT `class_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
    "down": "DROP TABLE class_students"
}