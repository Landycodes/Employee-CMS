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

//title ACSII
console.log(" _____                 _                       \r\n| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ \r\n|  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\\r\n| |___| | | | | | |_) | | (_) | |_| |  __\/  __\/\r\n|_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|\r\n                |_|            |___\/           \r\n __  __                                   \r\n|  \\\/  | __ _ _ __   __ _  __ _  ___ _ __ \r\n| |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__|\r\n| |  | | (_| | | | | (_| | (_| |  __\/ |   \r\n|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   \r\n                          |___\/           \r\n")


//SHOWS EMPLOYEE TABLE
function viewEmployee() {
    db.query(employeeTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU();
    })
};

//SHOWS DEPARTMENT TABLE
function viewDepartments(){
    db.query(departmentTable, (err, data) => {
       data ? console.table(data) : console.log(err)
       MENU();
   });
};

//SHOWS ROLE TABLE
function viewRole() {
    db.query(roleTable, (err, data) => {
        data ? console.table(data) : console.log(err)
        MENU();
    })
};

//PROMPTS 'ADD AN EMPLOYEE' QUESTIONS AND RETURNS MENU
function employeeInfo() {
    //set role choices
    let roleArray = [];
    db.query('SELECT role.title, role.id FROM role', (err, data) => {
        !data 
            ? console.error(err)
            : data = data.map(({ title, id }) => ({name: title, value: id}));
        for (let i = 0; i < data.length; i++) {
            roleArray.push(data[i])
        }
    return roleArray;
    });

    //set manager choices
    let managerArray = [];
    db.query('SELECT CONCAT(first_name , \', \' , last_name) as manager, employee.id FROM employee ;', (err, data) => {
        !data 
            ? console.error(err)
            : data = data.map(({ manager, id }) => ({name: manager, value: id}));
        for (let i = 0; i < data.length; i++) {
            managerArray.push(data[i])
        }
        managerArray.push({name: 'None', value: null})
        return managerArray;
    })
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
            choices: managerArray
        }
    ])
    .then((empData) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${empData.firstName}', '${empData.lastName}', ${empData.role}, ${empData.manager});`, (err, data) => {
                data ? true
                    : console.log(err)
            }) 

        console.log('***Employee added to database!***');
        MENU();
    })
    
};

//PROMPTS add ROLE INFORMATION AND RETURNS MENU
function newRole() {
    let deptArray = [];
    db.query('SELECT name, id FROM department', (err, data) => {
        !data 
            ? console.error(err)
            : data = data.map(({ name, id }) => ({name: name, value: id}));
        for (let i = 0; i < data.length; i++) {
            deptArray.push(data[i])
        }
    return deptArray;
    });
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
            choices: deptArray
        }
    ])
    .then((nrData) => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${nrData.roleName}', ${nrData.roleSalary}, ${nrData.roleDepartment});`, (err, data) => {
            data ? console.log('***role added!***') : console.log('sOmEtHiNg WeNt WrOnG\n' + err)
            MENU();
        })
    })
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
            depData != null ? console.log('***Department added!***') : console.log('Cannot add empty value\n' + err)
            MENU();
        })
    })
};

//PROMPTS TO SELECT EMPLOYEE AND ROLE, RETURNS MENU
function updateRole() {
    let empArray = [];
    let roleArray = [];

   db.query('SELECT CONCAT(first_name , \', \' , last_name) as name, employee.id FROM employee;', (err, data) => {
        !data 
            ? console.error(err)
            : data = data.map(({ name, id }) => ({name: name, value: id}));
            for (let i = 0; i < data.length; i++) {
                empArray.push(data[i])
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'select_employee',
                message: 'Which employee role do you want to update?',
                choices: empArray
            }
        ])
        .then(({select_employee}) => {
            db.query('SELECT role.title, role.id FROM role', (err, data) => {
                !data 
                    ? console.error(err)
                    : data = data.map(({ title, id }) => ({name: title, value: id}));
                for (let i = 0; i < data.length; i++) {
                    roleArray.push(data[i])
                }
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee_role',
                        message: 'Assign a role to employee', //maybe change employee to ${updateEmployee.select_employee} name
                        choices: roleArray 
                    }
                ])
                .then(({employee_role}) => {
                    db.query(`UPDATE employee SET role_id = ${employee_role} WHERE id = ${select_employee};`, (err, data) => {
                        !data
                            ? console.error(err)
                            : console.log('***Employee has been updated***')
                            MENU()
                    })
                })
            })    
        })
    })
};


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

