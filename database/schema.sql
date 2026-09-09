CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  leave_type VARCHAR(100) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  CONSTRAINT valid_leave_status CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT valid_leave_dates CHECK (from_date <= to_date)
);
