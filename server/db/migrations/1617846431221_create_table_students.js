module.exports = {
    "up": "CREATE TABLE `students` ( `id` int NOT NULL AUTO_INCREMENT, `name` varchar(45) NOT NULL, `surname` varchar(45) DEFAULT NULL, `dateofbirth` date NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
    "down": "DROP TABLE students"
}