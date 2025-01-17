import inquirer from 'inquirer';
import { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole,updateEmployeeDepartment } from './db.js';

// Function to pad strings to align columns
function padString(str, length) {
  return str.padEnd(length, ' ');
}

// Function to print a simple table with aligned columns
function printAlignedTable(headers, data) {
  // Calculate the maximum length of each column, including headers
  const columnWidths = headers.map(header => Math.max(header.length, ...data.map(row => String(row[header]).length)));

  // Print header row
  const headerRow = headers.map((header, index) => padString(header, columnWidths[index])).join(' | ');
  console.log(headerRow);
  console.log('-'.repeat(headerRow.length)); // Simple separator
  
  // Print each data row
  data.forEach(row => {
    const rowData = headers.map((header, index) => padString(String(row[header] || ''), columnWidths[index]));
    console.log(rowData.join(' | '));
  });

  console.log('-'.repeat(headerRow.length)); // End separator
}

// Function to view all departments
async function viewDepartments() {
  try {
    const departments = await getDepartments();
    if (departments.length === 0) {
      console.log('No departments found.');
      return;
    }

    const headers = ['id', 'name'];
    printAlignedTable(headers, departments);
  } catch (err) {
    console.error('Error retrieving departments:', err.message);
  }
}

// Function to view all roles
async function viewRoles() {
  try {
    const roles = await getRoles();
    if (roles.length === 0) {
      console.log('No roles found.');
      return;
    }

    const headers = ['role_id', 'job_title', 'salary', 'department'];
    printAlignedTable(headers, roles);
  } catch (err) {
    console.error('Error retrieving roles:', err.message);
  }
}

// Function to view all employees
async function viewEmployees() {
  try {
    const employees = await getEmployees();
    if (employees.length === 0) {
      console.log('No employees found.');
      return;
    }

    const headers = ['employee_id', 'first_name', 'last_name', 'job_title', 'salary', 'department', 'manager'];
    printAlignedTable(headers, employees);
  } catch (err) {
    console.error('Error retrieving employees:', err.message);
  }
}

// Function to add a department
async function addNewDepartment() {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:',
    },
  ]);
  await addDepartment(departmentName);
  console.log(`Department "${departmentName}" added successfully.`);
}

// Function to add a role
async function addNewRole() {
  const departments = await getDepartments();
  const departmentChoices = departments.map(department => ({
    name: department.name,
    value: department.id,
  }));

  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the new role:',
      validate: input => !isNaN(input) ? true : 'Please enter a valid salary.',
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departmentChoices,
    },
  ]);

  await addRole(title, salary, departmentId);
  console.log(`Role "${title}" added successfully.`);
}

// Function to add a new employee
async function addNewEmployee() {
  const roles = await getRoles();
  const roleChoices = roles.map(role => ({
    name: role.job_title,
    value: role.role_id,
  }));

  const employees = await getEmployees();
  const managerChoices = employees.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.employee_id,
  }));

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the new employee:',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the new employee:',
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role for the new employee:',
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager for the new employee (or select None):',
      choices: [...managerChoices, { name: 'None', value: null }],
    },
  ]);

  await addEmployee(firstName, lastName, roleId, managerId);
  console.log(`Employee "${firstName} ${lastName}" added successfully.`);
}

// Function to update an employee's role
async function updateEmployeeRoleAction() {
  const employees = await getEmployees();
  const employeeChoices = employees.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.employee_id,
  }));

  const roles = await getRoles();
  const roleChoices = roles.map(role => ({
    name: role.job_title,
    value: role.role_id,
  }));

  const { employeeId, newRoleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'newRoleId',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    },
  ]);

  await updateEmployeeRole(employeeId, newRoleId);
  console.log('Employee role updated successfully.');
}

async function updateEmployeeDepartmentAction() {
    try {
      // Fetch employees and departments
      const employees = await getEmployees();
      const departments = await getDepartments();
  
      if (employees.length === 0) {
        console.log('No employees found.');
        return;
      }
  
      if (departments.length === 0) {
        console.log('No departments found.');
        return;
      }
  
      // Prepare employee and department choices
      const employeeChoices = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.employee_id,
      }));
  
      const departmentChoices = departments.map(department => ({
        name: department.name,
        value: department.id,
      }));
  
      // Prompt the user to select an employee and a new department
      const { employeeId, newDepartmentId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'newDepartmentId',
          message: 'Select the new department for the employee:',
          choices: departmentChoices,
        },
      ]);
  
      // Update the employee's department in the database
      await updateEmployeeDepartment(employeeId, newDepartmentId);
      console.log('Employee department updated successfully.');
    } catch (err) {
      console.error('Error updating employee department:', err.message);
    }
  }

// Main menu for the application
async function mainMenu() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update an employee department',
          'Exit',
        ],
      },
    ]);

  switch (action) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addNewDepartment();
      break;
    case 'Add a role':
      await addNewRole();
      break;
    case 'Add an employee':
      await addNewEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRoleAction();
      break;
    case 'Update an employee department':
      await updateEmployeeDepartmentAction();
      break;
    case 'Exit':
      console.log('Exiting the application.');
      process.exit();
  }

  mainMenu(); // Return to the main menu after an action
}

mainMenu(); // Start the application