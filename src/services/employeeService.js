const employeeModel = require('../models/employeeModel');

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const createEmployee = async (input) => {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const department = typeof input.department === 'string' ? input.department.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';

  if (!name) throw { statusCode: 400, message: 'Name is required' };
  if (!department) throw { statusCode: 400, message: 'Department is required' };
  if (!email || !isValidEmail(email)) throw { statusCode: 400, message: 'A valid email is required' };

  return employeeModel.createEmployee({ name, department, email });
};

module.exports = { createEmployee };
