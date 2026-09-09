const pool = require('../config/db');

const createEmployee = async ({ name, department, email }) => {
  const result = await pool.query(
    `INSERT INTO employees (name, department, email)
     VALUES ($1, $2, $3)
     RETURNING id, name, department, email`,
    [name, department, email]
  );
  return result.rows[0];
};

const findEmployeeById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, department, email FROM employees WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { createEmployee, findEmployeeById };
