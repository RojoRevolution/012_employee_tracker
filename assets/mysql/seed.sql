USE employees_db;

INSERT INTO department(dept_name)
VALUES
('Crew'),
('Lab'),
('Management'),
('Custodial'),


INSERT INTO roles(role_name, salary, dept_id)
VALUES
('Captain', 50000, 1),
('Cook', 10000, 1),
('Delivery Boy', 5000, 1),
('Accountant', 75000, 3),
('Janitor', 100000, 4)


INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Turanga', 'Leela', 1, null),
('Bender', 'Rodriguez', 2, 1),
('Phillip', 'Fry', 3, 1 ),
('Hermes', 'Conrad', 4, null),
('Scruffy', null, 5, null)