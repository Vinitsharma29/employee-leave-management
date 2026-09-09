const employeeService = require('../services/employeeService');

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body || {});
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEmployee };
