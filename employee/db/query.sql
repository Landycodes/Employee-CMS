SELECT 
employee.id AS ID,
employee.first_name AS 'First Name',
employee.last_name AS 'Last Name',
role.title AS Title,
department.name AS Department,
role.salary AS Salary,
employee.manager_id AS Manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

SELECT title from role;

