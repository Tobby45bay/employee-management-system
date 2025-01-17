# Employee Management System

This command-line application allows you to manage a company's employee database using Node.js, Inquirer, and PostgreSQL. The application provides functionality to view, add, update, and manage departments, roles, and employees.

## Features

- **View all departments**: View a list of all departments in the company.
- **View all roles**: View a list of all roles, their salaries, and the departments they belong to.
- **View all employees**: View a list of employees, their roles, departments, and managers.
- **Add a department**: Add a new department to the company.
- **Add a role**: Add a new role to a department.
- **Add an employee**: Add a new employee to the company, assigning them a role and a manager.
- **Update an employee role**: Update the role of an existing employee.
- **Update an employee department**: Update the department of an existing employee.

## Prerequisites

Before you can run this application, you will need:

- [Node.js](https://nodejs.org/) installed on your computer.
- A PostgreSQL database set up with the following schema:
  - **department**: id, name
  - **role**: id, title, salary, department_id (foreign key to department)
  - **employee**: id, first_name, last_name, role_id (foreign key to role), manager_id (foreign key to employee, nullable)

You can use the `seeds.sql` file to pre-populate your database with sample data.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/employee-management-system.git
    ```

2. Navigate to the project directory:
    ```bash
    cd employee-management-system
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file to store your PostgreSQL database connection details:
    ```
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    ```

## Usage

To run the application, use the following command:

```bash
node index.js
