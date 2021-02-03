CREATE database employees_db;

USE employees_db;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT primary key,
  name VARCHAR(30) NULL
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT primary key,
  title VARCHAR(30) NULL,
  salary DECIMAL(8,2),
  department_id INT,
  FOREIGN KEY (department_id)
	REFERENCES department(id)
	ON DELETE CASCADE
);

CREATE TABLE employee(
    id INT NOT NULL auto_increment primary key,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT,
    FOREIGN KEY (role_id)
		REFERENCES role(id),
    manager_id INT NULL
);
