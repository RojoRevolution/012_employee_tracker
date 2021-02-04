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


const init = () => {
    log(chalk.blue('\n-------------------------------------------'))
    log(chalk.red('Welcome to The Employee Tracker Application'));
    log(chalk.blue('------------------------------------------- \n'))
    startMenu();
};

const startMenu = () => {
    log(chalk.green('\n========================================= \n'))
    inquirer.prompt(startOptions)
        .then((response) => {
            switch (response.action) {
                case 'View All Empoyees':
                    viewAll();
                    break;

                case 'View All Empoyees by Department':
                    viewAllDept();
                    break;

                case 'View All Employees by Role':
                    // DO SOMETHING
                    break;
                case '--- Exit App ---':
                    log(chalk.blue('\nxxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red('Terminating Applicaiton...'))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxx \n'))
                    connection.end();
                    break;
            }
        })
}

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
                    console.log(response.allDepts);
                    // USE ? IN QUERY and pass in variable inside the [] in connection.query
                    let query =
                        "SELECT ?, roles.role_name, roles.salary, employee.first_name, employee.last_name " +
                        "FROM department " +
                        "INNER JOIN roles ON department.dept_id = roles.dept_id " +
                        "INNER JOIN employee ON roles.role_id = employee.role_id;";
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
}










