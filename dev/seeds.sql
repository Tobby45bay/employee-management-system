-- Insert sample departments
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Human Resources'),
  ('Marketing');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Software Engineer', 80000, 2),
  ('Sales Associate', 50000, 1),
  ('HR Manager', 60000, 3),
  ('Marketing Director', 95000, 4);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),               -- Software Engineer with no manager
  ('Jane', 'Smith', 3, NULL),             -- HR Manager with no manager
  ('Bob', 'Johnson', 2, 1),               -- Sales Associate, manager is John Doe
  ('Alice', 'Williams', 4, 3);            -- Marketing Director, manager is Jane Smith