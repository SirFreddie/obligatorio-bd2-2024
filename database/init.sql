CREATE DATABASE IF NOT EXISTS `penca_ucu` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE `penca_ucu`;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`user` (
  `user_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`team` (
  `team_id` VARCHAR(3) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `team_code` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`team_id`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

INSERT INTO
  `penca_ucu`.`team` (`team_id`, `name`, `team_code`)
VALUES
  ('ARG', 'Argentina', 'AR'),
  ('BOL', 'Bolivia', 'BO'),
  ('BRA', 'Brazil', 'BR'),
  ('CHI', 'Chile', 'CL'),
  ('COL', 'Colombia', 'CO'),
  ('ECU', 'Ecuador', 'EC'),
  ('PAR', 'Paraguay', 'PY'),
  ('PER', 'Peru', 'PE'),
  ('URU', 'Uruguay', 'UY'),
  ('VEN', 'Venezuela', 'VE'),
  ('USA', 'United States', 'US'),
  ('MEX', 'Mexico', 'MX'),
  ('CAN', 'Canada', 'CA'),
  ('CRC', 'Costa Rica', 'CR'),
  ('JAM', 'Jamaica', 'JM'),
  ('PAN', 'Panama', 'PA');


CREATE TABLE IF NOT EXISTS `penca_ucu`.`career` (
  `career_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`career_id`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

INSERT INTO
  `penca_ucu`.`career` (name)
VALUES
  ('Ingenieria en Sistemas'),
  ('Licenciatura en Administracion'),
  ('Contador Publico'),
  ('Licenciatura en Economia'),
  ('Licenciatura en Psicología'),
  ('Medicina'),
  ('Derecho'),
  ('Comunicacion Social'),
  ('Arquitectura'),
  ('Licenciatura en Educacion'),
  ('Licenciatura en Marketing'),
  ('Licenciatura en Diseño Grafico'),
  ('Licenciatura en Relaciones Internacionales'),
  ('Ingenieria Industrial'),
  ('Licenciatura en Biologia'),
  ('Licenciatura en Ciencias de la Computacion'),
  ('Licenciatura en Ciencias Ambientales'),
  ('Licenciatura en Historia'),
  ('Licenciatura en Filosofia'),
  ('Licenciatura en Matemáticas');

CREATE TABLE IF NOT EXISTS `penca_ucu`.`admin` (
  `admin_id` INT NOT NULL,
  PRIMARY KEY (`admin_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `penca_ucu`.`user` (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`student` (
  `student_id` INT NOT NULL,
  `points` INT DEFAULT 0,
  `first_place_prediction` VARCHAR(3) NOT NULL,
  `second_place_prediction` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `penca_ucu`.`user` (`user_id`),
  FOREIGN KEY (`first_place_prediction`) REFERENCES `penca_ucu`.`team` (`team_id`),
  FOREIGN KEY (`second_place_prediction`) REFERENCES `penca_ucu`.`team` (`team_id`),
  CONSTRAINT chk_different_predictions CHECK (
    `first_place_prediction` <> `second_place_prediction`
  )
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`student_career` (
  `career_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  PRIMARY KEY (`career_id`, `student_id`),
  FOREIGN KEY (`career_id`) REFERENCES `penca_ucu`.`career` (`career_id`),
  FOREIGN KEY (`student_id`) REFERENCES `penca_ucu`.`student` (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`game` (
  `stage` ENUM (
    'Fase de grupos',
    'Cuartos de final',
    'Semifinal',
    'Partido por el tercer lugar',
    'Final'
  ) NOT NULL,
  `team_id_local` VARCHAR(3) NOT NULL,
  `team_id_visitor` VARCHAR(3) NOT NULL,
  `date` DATETIME NOT NULL,
  `local_result` INT,
  `visitor_result` INT,
  PRIMARY KEY (`stage`, `team_id_local`, `team_id_visitor`),
  UNIQUE (`team_id_local`, `team_id_visitor`, `stage`),
  FOREIGN KEY (`team_id_local`) REFERENCES `penca_ucu`.`team` (`team_id`),
  FOREIGN KEY (`team_id_visitor`) REFERENCES `penca_ucu`.`team` (`team_id`),
  CONSTRAINT chk_different_teams CHECK (`team_id_local` <> `team_id_visitor`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

DELIMITER $$

CREATE TRIGGER `before_game_insert` 
BEFORE INSERT ON `game`
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM `game`
    WHERE (`team_id_local` = NEW.`team_id_local` AND `team_id_visitor` = NEW.`team_id_visitor` AND `stage` = NEW.`stage`)
       OR (`team_id_local` = NEW.`team_id_visitor` AND `team_id_visitor` = NEW.`team_id_local` AND `stage` = NEW.`stage`)
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'This combination of teams and stage already exists.';
  END IF;
END$$

DELIMITER ;

CREATE TABLE IF NOT EXISTS `penca_ucu`.`prediction` (
  `local_result` INT NOT NULL,
  `visitor_result` INT NOT NULL,
  `student_id` INT NOT NULL,
  `team_id_local` VARCHAR(3),
  `team_id_visitor` VARCHAR(3),
  `stage` ENUM (
    'Fase de grupos',
    'Cuartos de final',
    'Semifinal',
    'Partido por el tercer lugar',
    'Final'
  ) NOT NULL,
  `points` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`student_id`,`stage`, `team_id_local`, `team_id_visitor`),
  UNIQUE (`student_id`, `team_id_local`, `team_id_visitor`, `stage`),
  FOREIGN KEY (`student_id`) REFERENCES `penca_ucu`.`student` (`student_id`),
  FOREIGN KEY (`team_id_local`, `team_id_visitor`, `stage`) REFERENCES `penca_ucu`.`game` (`team_id_local`, `team_id_visitor`, `stage`)
) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

INSERT INTO `penca_ucu`.`user` (`user_id`, `name`, `surname`, `email`, `password`) 
  VALUES ('48513221', 'Rodrigo', 'Luque', 'rodrigoluquepuig@gmail.com', '$2a$10$tBNSgUZs.VTHZE8rWQj76uOGUwX4msjyGqyVPJJsk8CANdiUvy3Oi');

INSERT INTO `penca_ucu`.`user` (`user_id`, `name`, `surname`, `email`, `password`) 
  VALUES ('00000000', 'Juan', 'Perez', 'admin@admin.com', '$2a$10$tBNSgUZs.VTHZE8rWQj76uOGUwX4msjyGqyVPJJsk8CANdiUvy3Oi');

INSERT INTO `penca_ucu`.`admin` (`admin_id`) VALUES ('00000000');

INSERT INTO `penca_ucu`.`student` (`student_id`, `points`, `first_place_prediction`, `second_place_prediction`)
  VALUES (48513221,	6,	'URU',	'ARG');

INSERT INTO `penca_ucu`.`student_career` (`career_id`, `student_id`)
  VALUES (1, 48513221);

INSERT INTO `penca_ucu`.`game` (`stage`,`team_id_local`,`team_id_visitor`,`date`,`local_result`,`visitor_result`) VALUES
  ('Fase de grupos','ARG','CAN','2024-06-20 19:33:59',2,0),
  ('Fase de grupos','ARG','PER','2024-06-29 21:00:41',NULL,NULL),
  ('Fase de grupos','BOL','PAN','2024-07-01 22:00:14',NULL,NULL),
  ('Fase de grupos','BRA','COL','2024-07-02 22:00:54',NULL,NULL),
  ('Fase de grupos','BRA','CRC','2024-06-24 22:00:07',NULL,NULL),
  ('Fase de grupos','CAN','CHI','2024-06-29 21:00:03',NULL,NULL),
  ('Fase de grupos','CHI','ARG','2024-06-25 22:00:15',NULL,NULL),
  ('Fase de grupos','COL','CRC','2024-06-28 19:00:59',NULL,NULL),
  ('Fase de grupos','COL','PAR','2024-06-24 19:00:40',NULL,NULL),
  ('Fase de grupos','CRC','PAR','2024-07-02 22:00:23',NULL,NULL);

INSERT INTO `penca_ucu`.`game` (`stage`,`team_id_local`,`team_id_visitor`,`date`,`local_result`,`visitor_result`) VALUES
  ('Fase de grupos','ECU','JAM','2024-06-26 19:00:37',NULL,NULL),
  ('Fase de grupos','ECU','VEN','2024-06-22 19:35:45',1,2),
  ('Fase de grupos','JAM','VEN','2024-06-30 21:00:50',NULL,NULL),
  ('Fase de grupos','MEX','ECU','2024-06-30 21:00:23',NULL,NULL),
  ('Fase de grupos','MEX','JAM','2024-06-22 22:00:08',1,0),
  ('Fase de grupos','PAN','USA','2024-06-27 19:00:41',NULL,NULL),
  ('Fase de grupos','PAR','BRA','2024-06-28 22:00:37',NULL,NULL),
  ('Fase de grupos','PER','CAN','2024-06-25 19:00:51',NULL,NULL),
  ('Fase de grupos','PER','CHI','2024-06-21 19:35:14',0,0),
  ('Fase de grupos','URU','BOL','2024-06-27 22:00:22',NULL,NULL);
  
INSERT INTO `penca_ucu`.`game` (`stage`,`team_id_local`,`team_id_visitor`,`date`,`local_result`,`visitor_result`) VALUES
  ('Fase de grupos','URU','PAN','2024-06-23 22:00:11',NULL,NULL),
  ('Fase de grupos','USA','BOL','2024-06-23 19:00:30',2,0),
  ('Fase de grupos','USA','URU','2024-07-01 22:00:33',NULL,NULL),
  ('Fase de grupos','VEN','MEX','2024-06-26 22:00:07',NULL,NULL);

INSERT INTO `penca_ucu`.`prediction` (`local_result`,`visitor_result`,`student_id`,`team_id_local`,`team_id_visitor`,`stage`,`points`) VALUES
  (3,1,48513221,'BRA','COL','Fase de grupos',0),
  (2,0,48513221,'BRA','CRC','Fase de grupos',0),
  (1,2,48513221,'CAN','CHI','Fase de grupos',0),
  (1,3,48513221,'CHI','ARG','Fase de grupos',0),
  (0,1,48513221,'COL','CRC','Fase de grupos',0),
  (0,2,48513221,'COL','PAR','Fase de grupos',0),
  (0,1,48513221,'CRC','PAR','Fase de grupos',0),
  (0,0,48513221,'ECU','JAM','Fase de grupos',0),
  (0,2,48513221,'JAM','VEN','Fase de grupos',0),
  (2,0,48513221,'MEX','ECU','Fase de grupos',0),
  (3,1,48513221,'ARG','PER','Fase de grupos',0),
  (1,2,48513221,'BOL','PAN','Fase de grupos',0);
INSERT INTO `penca_ucu`.`prediction` (`local_result`,`visitor_result`,`student_id`,`team_id_local`,`team_id_visitor`,`stage`,`points`) VALUES
	 (1,0,48513221,'MEX','JAM','Fase de grupos',4),
	 (1,0,48513221,'PAN','USA','Fase de grupos',0),
	 (1,3,48513221,'PAR','BRA','Fase de grupos',0),
	 (2,1,48513221,'PER','CAN','Fase de grupos',0),
	 (2,1,48513221,'URU','BOL','Fase de grupos',0),
	 (2,1,48513221,'URU','PAN','Fase de grupos',0),
	 (2,1,48513221,'USA','BOL','Fase de grupos',2),
	 (1,3,48513221,'USA','URU','Fase de grupos',0),
	 (0,1,48513221,'VEN','MEX','Fase de grupos',0);
