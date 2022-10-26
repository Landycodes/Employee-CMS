//write prompts and menus here
const inquirer = require('inquirer');
const mysql = require('mysql2');
const {employeeTable, roleTable, departmentTable} = require('./assets/queries');
const {mainMenu, addEmployee, updateEmployee, addDepartment, addRole} = require('./assets/questions');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('connection made to employee database')
);

// function getRole() {
//     let roleArray = [];
//     db.query('SELECT title FROM role', (err, data) => {
//         for (let i = 0; i < data.length; i++) {
//             roleArray.push(Object.values(data[i]))
//         }
//     roleArray = roleArray.flat(1)
//     console.log(roleArray)
//     return roleArray;
// });
// }
//getRole()

function viewEmployee() {
    db.query(employeeTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU()
    })
}

function employeeInfo() {
    inquirer.prompt(addEmployee)
    .then((empData) => {
        console.log(empData);
        console.log('send this info to database employee table');
        MENU();
    })
};

function updateRole() {
    inquirer.prompt(updateEmployee)
    .then((upRole) => {
        console.log(upRole);
        console.log('add update to database role table');
        MENU();
    })
};

function viewRole() {
    db.query(roleTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU();
    })
};

function newRole() {
    inquirer.prompt(addRole)
    .then((nrData) => {
        console.log(nrData)
        console.log('add to role table db')
        MENU();
    })
};
function viewDepartments(){
    db.query(departmentTable, (err, data) => {
       data ? console.table(data) : console.log(err)
       MENU();
   });
};

function newDepartment() {
    inquirer.prompt(addDepartment)
    .then((depData) => {
        db.query('INSERT INTO department (name) VALUES (?)', depData.departmentName, (err, depData) => {
            depData != null ? console.log('Department added!') : console.log('Cannot add empty value\n' + err)
            MENU();
        })
    })
};

function MENU() {
inquirer.prompt(mainMenu)
.then((data) => {
    switch(data.main_menu) {
        case 'view all employees': // retrieve all employee
            viewEmployee()
            break;
        case 'add an employee':
            employeeInfo();
            break;
        case 'update an employee role':
            updateRole();
            break;
        case 'view all departments':
            viewDepartments();
            break;
        case 'add a department':
            newDepartment();
            break;
        case 'view all roles':
            viewRole();
            break;
        case 'add a role':
            newRole();
            break;
    }
}
)};
MENU();
