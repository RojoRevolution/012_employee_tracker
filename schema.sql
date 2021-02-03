CREATE database employees_db;

USE employees_db;

CREATE TABLE employee (
    id INT NOT NULL auto_increment PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
);

CREATE TABLE role (
    id INT NOT NULL auto_increment PRIMARY KEY,
    title VARCHAR(30);
    salary DECIMAL(8,2);
    department_id INT(30),
);

CREATE TABLE department (
    id INT NOT NULL auto_increment PRIMARY KEY,
    name VARCHAR(30),
)