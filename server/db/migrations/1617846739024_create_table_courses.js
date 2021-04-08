module.exports = {
    "up": "CREATE TABLE `courses` (`id` int NOT NULL AUTO_INCREMENT,`course_name` varchar(45) DEFAULT NULL,`credits` tinyint(1) DEFAULT '0',PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
    "down": "DROP TABLE courses"
}