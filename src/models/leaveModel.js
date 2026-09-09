const pool = require('../config/db');

const createLeave = async ({ employee_id, leave_type, from_date, to_date }) => {
  const result = await pool.query(
    `INSERT INTO leave_requests (employee_id, leave_type, from_date, to_date, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING id, employee_id, leave_type, from_date, to_date, status`,
    [employee_id, leave_type, from_date, to_date]
  );
  return result.rows[0];
};

const getLeaves = async ({ employeeId, status }) => {
  const values = [];
  const conditions = [];

  if (employeeId !== undefined) {
    values.push(employeeId);
    conditions.push(`employee_id = $${values.length}`);
  }
  if (status !== undefined) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT id, employee_id, leave_type, from_date, to_date, status
     FROM leave_requests${whereClause} ORDER BY id`,
    values
  );
  return result.rows;
};

const updateLeaveStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE leave_requests SET status = $1 WHERE id = $2
     RETURNING id, employee_id, leave_type, from_date, to_date, status`,
    [status, id]
  );
  return result.rows[0] || null;
};

const getApprovedLeaveSummary = async (employeeId) => {
  const result = await pool.query(
    `SELECT leave_type,
            SUM((to_date - from_date) + 1)::INTEGER AS total_days
     FROM leave_requests
     WHERE employee_id = $1 AND status = 'approved'
     GROUP BY leave_type
     ORDER BY leave_type`,
    [employeeId]
  );
  return result.rows;
};

module.exports = { createLeave, getLeaves, updateLeaveStatus, getApprovedLeaveSummary };
