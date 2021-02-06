-- REMOVE IF YOU DON"T WANT TO DELETE EXISTING DB
DROP DATABASE employees_db;

CREATE database employees_db;

USE employees_db;

CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT primary key,
  dept_name VARCHAR(30)
);

CREATE TABLE roles(
  role_id INT NOT NULL AUTO_INCREMENT primary key,
  role_name VARCHAR(30),
  salary DECIMAL(8,2),
  dept_id INT
);

CREATE TABLE employee(
    employee_id INT NOT NULL auto_increment primary key,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);
