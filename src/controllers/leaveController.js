const leaveService = require('../services/leaveService');

const submitLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.submitLeave(req.body || {});
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

const getLeaves = async (req, res, next) => {
  try {
    const leaves = await leaveService.listLeaves(req.query);
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const leave = await leaveService.changeLeaveStatus(req.params.id, req.body && req.body.status);
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await leaveService.leaveSummary(req.params.employee_id);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitLeave, getLeaves, updateStatus, getSummary };
