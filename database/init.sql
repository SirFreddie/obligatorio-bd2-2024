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