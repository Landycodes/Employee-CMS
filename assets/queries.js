const Queries = {
    employeeTable: `SELECT 
    employee.id AS ID,
    employee.first_name AS 'First Name',
    employee.last_name AS 'Last Name',
    role.title AS Title,
    department.name AS Department,
    role.salary AS Salary,
    employee.manager_id AS Manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id;`,

    roleTable: `SELECT
    role.id AS ID, 
    role.title AS Title, 
    department.name AS Department, 
    role.salary AS Salary 
    FROM role 
    JOIN department ON role.department_id = department.id;`,

    departmentTable: `SELECT 
    department.id AS ID, 
    department.name AS Department 
    FROM department;`
}

module.exports = Queries;