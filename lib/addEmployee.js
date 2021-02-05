let inquirer = require("inquirer");
const mysql = require('mysql');

const connection = require("./connection");


const addEmployee = () => {
    connection.query(`SELECT employee.employee_id, employee.first_name, employee.last_name, roles.role_id, roles.role_name FROM employee JOIN roles ON employee.role_id = roles.role_id`,
        (err, res) => {
            let roleName = [];
            let roleID = [];
            res.forEach(({ role_name }) => {
                // roleName.push(role_name);
            });
            res.forEach(({ role_id }) => {
                roleID.push(role_id);
            });

            let employee = [];
            res.forEach(({ first_name }) => {
                employee.push(first_name);
            });

            // console.log(res);
            // console.log(res.role_name);
            // console.log(res.role_id);

            // Inquirer Questions
            inquirer
                .prompt([
                    {
                        name: 'firstName',
                        type: 'input',
                        message: 'What is the employess first name?',
                    }, {
                        name: 'lastName',
                        type: 'input',
                        message: 'what is the employees last name?',
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'What is this employees Role',
                        choices() {
                            const choiceArray = ['Not Applicable',];
                            res.forEach(({ role_name }) => {
                                choiceArray.push(role_name);
                            });
                            return choiceArray;
                        }
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is this employees Manager?',
                        choices() {
                            const choiceArray = ['Not Applicable',];
                            res.forEach(({ first_name }) => {
                                choiceArray.push(first_name);
                            });
                            return choiceArray;
                        }
                    },
                ]).then((response) => {
                    let firstName = response.firstName;
                    let lastName = response.lastName;
                    let choiceRole = response.role;
                    let role_id = 0;
                    let manager = response.manager;
                    let manager_id = 0;

                    for (var i = 1; i < roleID.length; i++) {
                        if (choiceRole === roleName) {
                            // console.log(roleName)
                            role_id = i;
                        } else {
                            role_id = null;
                        };
                    };

                    for (var i = 1; i < employee.length; i++) {
                        if (manager === employee) {
                            // console.log(roleName)
                            manager_id = i;
                        } else {
                            manager = null;
                        };
                    };
                    let query =
                        'INSERT INTO employee(first_name, last_name, role_id, manager_id) ' +
                        'VALUES(?, ?, ?, ?)';
                    connection.query(query, [firstName, lastName, role_id, manager_id],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.red.bold(`      Employee Added`));
                            log(chalk.blue.bold('--------------------------\n'));
                            // console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};


const getDeptdept = () => {
    let departments = [];
    connection.query(`SELECT employee.employee_id, employee.first_name, employee.last_name, roles.role_id, roles.role_name FROM employee JOIN roles ON employee.role_id = roles.role_id`,
        (err, res) => {

        }