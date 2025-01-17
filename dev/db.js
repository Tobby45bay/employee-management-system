import pg from 'pg'
const{Client } = pg;

// PostgreSQL client setup
const client = new Client({
    host: 'localhost',
    user: 'postgres', // Replace with your PostgreSQL username
    database: 'employee_tracker_db',
    password: 'K203tyvwh$', // Replace with your PostgreSQL password
    port: 5432,
  });
  
  client.connect();
  
// Function to get all departments
async function getDepartments() {
  const result = await client.query('SELECT id, name FROM department');
  return result.rows;
}

// Function to get all roles with department name and salary
async function getRoles() {
  const result = await client.query(`
    SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  return result.rows;
}

// Function to get all employees with their roles, departments, and managers
async function getEmployees() {
  const result = await client.query(`
    SELECT employee.id AS employee_id, employee.first_name, employee.last_name,
           role.title AS job_title, role.salary, department.name AS department,
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  return result.rows;
}

// Function to add a department
async function addDepartment(name) {
  const result = await client.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [name]);
  return result.rows[0].id;
}

// Function to add a role
async function addRole(title, salary, departmentId) {
  const result = await client.query(
    'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id',
    [title, salary, departmentId]
  );
  return result.rows[0].id;
}

// Function to add an employee
async function addEmployee(firstName, lastName, roleId, managerId) {
  const result = await client.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id',
    [firstName, lastName, roleId, managerId]
  );
  return result.rows[0].id;
}

// Function to update an employee's role
async function updateEmployeeRole(employeeId, newRoleId) {
  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
}

// Function to update the department of an employee
async function updateEmployeeDepartment(employeeId, departmentId) {
  await client.query('UPDATE employee SET department_id = $1 WHERE id = $2', [departmentId, employeeId]);
}


export { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeDepartment };