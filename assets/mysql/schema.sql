-- REMOVE IF YOU DON"T WANT TO DELETE EXISTING DB
DROP DATABASE databasename;

CREATE database employees_db;

USE employees_db;

CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT primary key,
  dept_name VARCHAR(30) NULL
);

CREATE TABLE roles(
  role_id INT NOT NULL AUTO_INCREMENT primary key,
  role_name VARCHAR(30) NULL,
  salary DECIMAL(8,2),
  dept_id INT
);

CREATE TABLE employee(
    employee_id INT NOT NULL auto_increment primary key,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT,
    manager_id INT NULL
);
