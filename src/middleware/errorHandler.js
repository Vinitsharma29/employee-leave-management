const errorHandler = (error, req, res, next) => {
  if (error.code === '23505') {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  if (error.statusCode) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Server/database error' });
};

module.exports = errorHandler;
