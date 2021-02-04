const mysql = require('mysql');
const chalk = require('chalk');
const log = console.log;
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'squalus',
    database: 'employees_db',
});

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
        choices: ['View All Empoyees', 'View All Empoyees by Department', 'View All Employees by Role', '--- Exit App ---']
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










