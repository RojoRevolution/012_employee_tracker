const mysql = require('mysql');
const chalk = require('chalk');
const log = console.log;
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = require("./connection");

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'squalus',
//     database: 'employees_db',
// });

// Connect
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    init();
});

const startOptions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View All Empoyees', 'View All Empoyees by Department', 'View All Employees by Role', 'Add New Department', 'Add New Role', 'Add New Employee', 'Update Roles', 'Update Department', '--- Exit App ---']
    }
]

// ======================= 
// Intro Function that only display a log on the screen
const init = () => {
    log(chalk.blue('-------------------------------------------'))
    log(chalk.blue('-------------------------------------------\n'))
    log(chalk.red('      Welcome to The Planet Express   '));
    log(chalk.red('      Employee Tracker Application   \n'));
    log(chalk.blue('------------------------------------------- '))
    log(chalk.blue('------------------------------------------- \n'))
    startMenu();
};

// ======================= 
// Initial Menu / Choices
const startMenu = () => {
    log(chalk.green('\n========================================= \n'))
    inquirer.prompt(startOptions)
        .then((response) => {
            // Switch case routes where each prompt will take the user
            switch (response.action) {
                case 'View All Empoyees':
                    viewAll();
                    break;

                case 'View All Empoyees by Department':
                    viewAllDept();
                    break;

                case 'View All Employees by Role':
                    viewAllRoles();
                    break;
                case 'Add New Department':
                    addDepartment();
                    break;
                case 'Add New Role':
                    addRole();
                    break;
                case 'Add New Employee':
                    addEmployee();
                    break;
                case 'Update Roles':
                    updateRole();
                    break;
                case 'Update Department':
                    updateDept();
                    break;
                case '--- Exit App ---':
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red('Terminating Applicaiton...'))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red("Remember: You're Not Paid To Think!"))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red("A Mindless Worker Is A Happy Worker!"))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red("Shut Up And Do Your Job!"))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    connection.end();
                    break;
            }
        })
}


// ================================================
//  =============== VIEW FUNCTIONS ===============
// ================================================

// ======================= 
// View All Employees
const viewAll = () => {
    let query =
        'SELECT * ' + 'FROM employee ' +
        'INNER JOIN roles ON employee.role_id = roles.role_id ' +
        'INNER JOIN department ON roles.dept_id = department.dept_id;';
    connection.query(query,
        (err, res) => {
            if (err) throw err;
            log(chalk.blue.bold('\n--------------------------'))
            log(chalk.blue.bold('Viewing All Employees\n'))
            console.table(res);
            startMenu();
        })
}

// ======================= 
// View All Employees By Department
const viewAllDept = () => {
    connection.query(`SELECT * FROM department`,
        (err, res) => {
            inquirer
                .prompt([
                    {
                        name: 'allDepts',
                        type: 'list',
                        message: 'Which Department Would You Like To View?',
                        choices() {
                            const choiceArray = [];
                            res.forEach(({ dept_name }) => {
                                choiceArray.push(dept_name);
                            });
                            return choiceArray;
                        }
                    },
                ]).then((response) => {
                    // USE ? IN QUERY and pass in variable inside the [] in connection.query
                    let query =
                        "SELECT department.dept_name, roles.role_name, roles.salary, employee.first_name, employee.last_name " +
                        "FROM department " +
                        "INNER JOIN roles ON (department.dept_id = roles.dept_id) " +
                        "INNER JOIN employee ON (roles.role_id = employee.role_id) " +
                        "WHERE (department.dept_name = ?)";
                    connection.query(query, [response.allDepts],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.blue.bold(`Viewing Employees By Department\n`));
                            console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};

// ======================= 
// View Employees by Roles
const viewAllRoles = () => {
    connection.query(`SELECT * FROM roles`,
        (err, res) => {
            inquirer
                .prompt([
                    {
                        name: 'allRoles',
                        type: 'list',
                        message: 'Which Roles Would You Like To View?',
                        choices() {
                            const choiceArray = [];
                            res.forEach(({ role_name }) => {
                                choiceArray.push(role_name);
                            });
                            return choiceArray;
                        }
                    },
                ]).then((response) => {
                    // USE ? IN QUERY and pass in variable inside the [] in connection.query
                    let query =
                        "SELECT roles.role_name, employee.first_name, employee.last_name, roles.salary, department.dept_name " +
                        "FROM roles " +
                        "INNER JOIN employee ON (employee.role_id = roles.role_id) " +
                        "INNER JOIN department ON (roles.dept_id = department.dept_id) " +
                        "WHERE (roles.role_name = ?);";
                    connection.query(query, [response.allRoles],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.blue.bold(`Viewing Employees By Role\n`));
                            console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};

// ================================================
//  ============== CREATE FUNCTIONS ===============
// ================================================

const addDepartment = () => {
    connection.query(`SELECT * FROM department`,
        (err, res) => {
            // Inquirer Questions
            inquirer
                .prompt([
                    {
                        name: 'deptName',
                        type: 'input',
                        message: 'What is the name of the department you want to add?',
                        validate: function (answer) {
                            if (answer === "") {
                                return console.log("A department name is required")
                            } else {
                                return true;
                            }

                        }
                    },
                ]).then((response) => {
                    let dept = response.deptName;

                    let query =
                        'INSERT INTO department(dept_name) ' +
                        'VALUES(?)';
                    connection.query(query, [dept],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.red.bold(`      Department Added`));
                            log(chalk.blue.bold('--------------------------\n'));
                            // console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};

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

const addRole = () => {
    connection.query(`SELECT department.dept_id, department.dept_name FROM department `,
        (err, res) => {
            let deptName = [];
            res.forEach(({ dept_name }) => {
                // [
                //     {
                //         deptID: res.dept_id,
                //         deptName = res.dept_name,
                //     },
                // ]
                deptName.push(dept_name);
            });
            console.log()


            // Inquirer Questions
            inquirer
                .prompt([
                    {
                        name: 'roleName',
                        type: 'input',
                        message: 'What is the name of this role?',
                        validate: function (answer) {
                            if (answer === "") {
                                return console.log("A name for this role is required")
                            } else {
                                return true;
                            }

                        }
                    }, {
                        name: 'salary',
                        type: 'input',
                        message: 'What is the salary for this role?',
                        validate: function (answer) {
                            if (answer === "") {
                                return console.log("A salary for this role is required")
                            } else {
                                return true;
                            }

                        }
                    },
                    {
                        name: 'deptName',
                        type: 'list',
                        message: 'What is the department for this role?',
                        choices() {
                            const choiceArray = ['Not Applicable',];
                            res.forEach(({ dept_name }) => {
                                choiceArray.push(dept_name);
                            });
                            return choiceArray;
                        }
                    },

                ]).then((response) => {
                    let dept_id;
                    let department = response.deptName;
                    for (var i = 1; i < deptName.length; i++) {
                        if (department === deptName) {
                            // console.log(roleName)
                            dept_id += i;
                        } else {
                            role_id = null;
                        };
                    };

                    let query =
                        'INSERT INTO roles(role_name, salary, dept_id) ' +
                        'VALUES(?, ?, ?)';
                    connection.query(query, [response.roleName, response.salary, dept_id],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.red.bold(`      Role Added`));
                            log(chalk.blue.bold('--------------------------\n'));
                            // console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};






// ================================================
//  ============== UPDATE FUNCTIONS ===============
// ================================================

// ======================= 
// Update Role
const updateRole = () => {
    connection.query(`SELECT role_id, role_name FROM roles`,
        (err, res) => {
            log(chalk.red('==============================='))
            console.table(res);
            inquirer
                .prompt([
                    {
                        name: 'chooseRole',
                        type: 'input',
                        message: 'Based on the Table Above, Enter The Role_ID You Want To Update',
                    }, {
                        name: 'updateRole',
                        type: 'input',
                        message: 'What Will This Role Be Updated To?',
                    },
                ]).then((response) => {
                    let roleID = response.chooseRole;
                    let newRole = response.updateRole;

                    let query =
                        "UPDATE roles SET role_name = ? WHERE role_id = ?;";
                    connection.query(query, [newRole, roleID],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.red.bold(`      Role Updated\n`));
                            log(chalk.blue.bold('--------------------------\n'));
                            // console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};

// ======================= 
// Update Department
const updateDept = () => {
    connection.query(`SELECT dept_id, dept_name FROM department`,
        (err, res) => {
            log(chalk.red('==============================='))
            console.table(res);
            inquirer
                .prompt([
                    {
                        name: 'chooseDept',
                        type: 'input',
                        message: 'Based on the Table Above, Enter The Department ID You Want To Update',
                    }, {
                        name: 'updateDept',
                        type: 'input',
                        message: 'What will this department be named?',
                    },
                ]).then((response) => {
                    let deptID = response.chooseDept;
                    let deptUpdate = response.updateDept;

                    let query =
                        "UPDATE department SET dept_name = ? WHERE dept_id = ?;";
                    connection.query(query, [deptUpdate, deptID],
                        (err, res) => {
                            if (err) throw err
                            log(chalk.blue.bold('\n--------------------------'));
                            log(chalk.red.bold(`      Department Updated\n`));
                            log(chalk.blue.bold('--------------------------\n'));
                            // console.table(res);
                            startMenu();
                        }
                    );
                });
        });
};








