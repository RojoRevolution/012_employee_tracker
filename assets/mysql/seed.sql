USE employees_db;

INSERT INTO department(dept_name)
VALUES
('Crew'),
('Lab'),
('Management'),
('Custodial')


INSERT INTO roles(role_name, salary, dept_id)
VALUES
('Captain', 30000, 1),
('Cook', 5000, 1),
('Delivery Boy', 5000, 1),
('Accountant', 50000, 3),
('CEO', 100000, 2),
('Janitor', 75000, 4),
('Intern', 0, 2)


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Turanga', 'Leela', 1, null),
('Bender', 'Rodriguez', 2, 1),
('Phillip', 'Fry', 3, 1 ),
('Hermes', 'Conrad', 4, 5),
('Hubert', 'Farnsworth', 5, null),
('Amy', 'Wong', 5, 5),
('Scruffy', null, 5, 5)