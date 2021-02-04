const mysql = require('mysql');
const chalk = require('chalk');
const log = console.log;
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
    log(chalk.blue('-------------------------------------------'))
    log(chalk.red('Welcome to The Employee Tracker Application'));
    log(chalk.blue('-------------------------------------------'))
    inquirer.prompt(startOptions)
        .then((response) => {
            console.log(response);
            switch (response.action) {
                case 'View All Empoyees':
                    // DO SOMETHING
                    break;

                case 'View All Empoyees by Department':
                    // DO SOMETHING
                    break;

                case 'View All Employees by Role':
                    // DO SOMETHING
                    break;
                case '--- Exit App ---':
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    log(chalk.red('Terminating Applicaiton...'))
                    log(chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxx'))
                    connection.end();
                    break;
            }
        })
};

function







