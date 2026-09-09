const employeeModel = require('../models/employeeModel');
const leaveModel = require('../models/leaveModel');

const FILTER_STATUSES = ['pending', 'approved', 'rejected'];
const UPDATE_STATUSES = ['approved', 'rejected'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isRealDate = (date) => {
  if (typeof date !== 'string' || !ISO_DATE.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const parsePositiveId = (value, fieldName) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw { statusCode: 400, message: `${fieldName} must be a positive integer` };
  }
  return id;
};

const validateDates = (fromDate, toDate) => {
  if (!isRealDate(fromDate)) {
    throw { statusCode: 400, message: 'from_date must be a valid date in YYYY-MM-DD format' };
  }
  if (!isRealDate(toDate)) {
    throw { statusCode: 400, message: 'to_date must be a valid date in YYYY-MM-DD format' };
  }
  if (fromDate > toDate) {
    throw { statusCode: 400, message: 'from_date cannot be after to_date' };
  }
};

const submitLeave = async (input) => {
  if (input.employee_id === undefined || input.employee_id === null || input.employee_id === '') {
    throw { statusCode: 400, message: 'employee_id is required' };
  }
  const employeeId = parsePositiveId(input.employee_id, 'employee_id');
  const leaveType = typeof input.leave_type === 'string' ? input.leave_type.trim() : '';
  if (!leaveType) throw { statusCode: 400, message: 'leave_type is required' };
  if (!input.from_date) throw { statusCode: 400, message: 'from_date is required' };
  if (!input.to_date) throw { statusCode: 400, message: 'to_date is required' };
  validateDates(input.from_date, input.to_date);

  const employee = await employeeModel.findEmployeeById(employeeId);
  if (!employee) throw { statusCode: 404, message: 'Employee not found' };

  return leaveModel.createLeave({
    employee_id: employeeId,
    leave_type: leaveType,
    from_date: input.from_date,
    to_date: input.to_date
  });
};

const listLeaves = async (query) => {
  let employeeId;
  if (query.employee_id !== undefined) employeeId = parsePositiveId(query.employee_id, 'employee_id');
  if (query.status !== undefined && !FILTER_STATUSES.includes(query.status)) {
    throw { statusCode: 400, message: 'status must be pending, approved, or rejected' };
  }
  return leaveModel.getLeaves({ employeeId, status: query.status });
};

const changeLeaveStatus = async (idValue, status) => {
  const id = parsePositiveId(idValue, 'Leave request id');
  if (!UPDATE_STATUSES.includes(status)) {
    throw { statusCode: 400, message: 'status must be approved or rejected' };
  }
  const leave = await leaveModel.updateLeaveStatus(id, status);
  if (!leave) throw { statusCode: 404, message: 'Leave request not found' };
  return leave;
};

const leaveSummary = async (employeeIdValue) => {
  const employeeId = parsePositiveId(employeeIdValue, 'employee_id');
  const employee = await employeeModel.findEmployeeById(employeeId);
  if (!employee) throw { statusCode: 404, message: 'Employee not found' };

  const rows = await leaveModel.getApprovedLeaveSummary(employeeId);
  const summary = rows.reduce((result, row) => {
    result[row.leave_type] = Number(row.total_days);
    return result;
  }, {});
  return { employee_id: employeeId, summary };
};

module.exports = { submitLeave, listLeaves, changeLeaveStatus, leaveSummary };
