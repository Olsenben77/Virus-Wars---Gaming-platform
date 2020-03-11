DROP DATABASE IF EXISTS highscore_db;

CREATE DATABASE highscore_db;

CREATE TABLE highscores (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    highscore_name VARCHAR(30) NOT NULL,
    devoured BOOLEAN DEFAULT false,
);
