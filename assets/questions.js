const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('connection made to employee database')
);
db.query('SELECT title FROM role', (err, data) => {
    console.log(data)
    })

const Questions = {
    mainMenu: {
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
    },
    addEmployee: [
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
            choices: ['role1', 'role2' /*available roles*/]
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is this employee's manager?",
            choices: ['None', 'man1' /*available managers*/]
        }
    ],
    updateEmployee: [
        {
            type: 'list',
            name: 'select_employee',
            message: 'Which employee role do you want to update?',
            choices: ['emp1', 'emp2' /*list employees here*/]
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'Assign a role to employee', //maybe change employee to ${updateEmployee.select_employee} name
            choices: ['role-1', 'role-2' /*list roles here*/]  
        }
    
    ],
    addDepartment: {
        type: 'input',
        name: 'departmentName',
        message: 'Please enter department name'
    },
    addRole: [
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
            choices: ['dep1', 'dep2'/*available departments*/]
        }
    ]  
};
module.exports = Questions