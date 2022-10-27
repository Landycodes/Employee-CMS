//IMPORT DEPENDENCIES AND QUERIES
const inquirer = require('inquirer');
const mysql = require('mysql2');
const {employeeTable, roleTable, departmentTable} = require('./employee/queries');
require('console.table');

//CONNECTION TO DATABASE
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('connection made to employee database')
);

//POPULATES CHOICES FOR COMMAND PROMPTS
let roleArray;
let employeeArr = [];
let deptArr = [];

function fillPrompts() {
    roleArray = [];
    db.query('SELECT title FROM role', (err, data) => {
        for (let i = 0; i < data.length; i++) {
            roleArray.push(Object.values(data[i]))
        }
    roleArray = roleArray.flat(1)
    return roleArray
});
db.query("SELECT CONCAT(first_name,' ', last_name) FROM employee;", (err, data) => {
        for (let i = 0; i < data.length; i++) {
            employeeArr.push(Object.values(data[i]))
        }
    employeeArr = employeeArr.flat(1)
    return employeeArr
});
    db.query("SELECT name FROM department;", (err, data) => {
        for (let i = 0; i < data.length; i++) {
            deptArr.push(Object.values(data[i]))
        }
    deptArr = deptArr.flat(1)
    return deptArr
});
};
//SHOWS EMPLOYEE TABLE
function viewEmployee() {
    db.query(employeeTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU()
    })
}

//PROMPTS 'ADD AN EMPLOYEE' QUESTIONS AND RETURNS MENU
function employeeInfo() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter first name of employee'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter last name of employee'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Enter employee role',
            choices: roleArray
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is this employee's manager?",
            choices: ['fixme']
        }
    ])
    .then((empData) => {
        console.log(empData);
        console.log('send this info to database employee table');
        MENU();
    })
};
//PROMPTS TO SELECT EMPLOYEE AND ROLE, RETURNS MENU
function updateRole() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'select_employee',
            message: 'Which employee role do you want to update?',
            choices: employeeArr
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'Assign a role to employee', //maybe change employee to ${updateEmployee.select_employee} name
            choices: roleArray 
        }
    ])
    .then((upRole) => {
        console.log(upRole);
        console.log('add update to database role table');
        MENU();
    })
};

//SHOWS ROLE TABLE
function viewRole() {
    db.query(roleTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU();
    })
};

//PROMPTS ROLE INFORMATION AND RETURNS MENU
function newRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of this role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'What department does this role belong to?',
            choices: deptArr
        }
    ])
    .then((nrData) => {
        console.log(nrData)
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', ['testrole', '10000', 'department_1'], (err, data) => {
        data ? console.log('role added!') : console.log('sOmEtHiNg WeNt WrOnG\n' + err)
        MENU();
    })
        console.log('add to role table db')
    })
};

//SHOWS DEPARTMENT TABLE
function viewDepartments(){
    db.query(departmentTable, (err, data) => {
       data ? console.table(data) : console.log(err)
       MENU();
   });
};

//PROMPTS FOR DEPARTMENT NAME, ADDS TO TABLE AND RETURNS MENU
function newDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Please enter department name'
    })
    .then((depData) => {
        db.query('INSERT INTO department (name) VALUES (?)', depData.departmentName, (err, depData) => {
            depData != null ? console.log('Department added!') : console.log('Cannot add empty value\n' + err)
            MENU();
        })
    })
};

fillPrompts();
//PROMPTS MAIN MENU AND RUNS ALL FUNCTIONS
function MENU() {
inquirer.prompt({
    type: 'list',
    name: 'main_menu',
    message: 'Select an option',
    choices: [
        'view all employees',
        'add an employee',
        'update an employee role',
        'view all departments',
        'add a department',
        'view all roles',
        'add a role'
    ]
})
.then((data) => {
    switch(data.main_menu) {
        case 'view all employees': // retrieve all employee
            viewEmployee()
            break;
        case 'add an employee':
            employeeInfo();
            fillPrompts();
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

