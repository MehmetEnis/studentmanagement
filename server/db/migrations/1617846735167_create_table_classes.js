module.exports = {
    "up": "CREATE TABLE `classes` (`id` int NOT NULL AUTO_INCREMENT,`class_name` varchar(45) NOT NULL,`department` varchar(45) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
    "down": "DROP TABLE classes"
}