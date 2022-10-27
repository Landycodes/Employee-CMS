-- enter data to put into table here
INSERT INTO department (name)
VALUES 
    ('department_1'), 
    ('department_2'),
    ('department_3'), 
    ('department_4');

INSERT INTO role (title, salary, department_id)
VALUES 
('lead engineer', 10000, 1),
('software engineer', 50000, 1),
('manager', 11000, 4),
('sales rep', 40000, 3),
('sales manager', 70000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Andrew', 'Landry', 01, null),
    ('mike', 'jones', 03, 1),
    ('lilac', 'spheres', 04, 2),
    ('bart', 'skrimpson', 03, 1),
    ('alyssha', 'keys', 02, 2),
    ('kristina', 'Landry', 01, null),
    ('bob', 'saggot', 04, 1);