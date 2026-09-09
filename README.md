# Employee Leave Management REST API

A REST API for managing employees and their leave requests. It is built as an internship assignment for TechnoYug Technologies LLP and uses PostgreSQL for persistent storage.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JavaScript
- dotenv

## Features

- Create employee
- Submit leave request with an automatic `pending` status
- List leave requests
- Filter leaves by employee and/or status
- Approve or reject a leave request
- View approved-leave summary by leave type
- Input validation and clear JSON error responses
- Proper HTTP status codes

## Prerequisites

- Node.js
- PostgreSQL
- npm

## Installation

```bash
git clone <repository-url>
cd employee-leave-management
npm install
```

## Environment Setup

Create a `.env` file by copying `.env.example`, then add your PostgreSQL credentials.

```bash
copy .env.example .env
```

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_leave_db
DB_USER=postgres
DB_PASSWORD=your_password
```

On macOS/Linux, use `cp .env.example .env` instead.

## Database Setup

Create the database, then execute the schema file.

```sql
CREATE DATABASE employee_leave_db;
```

```bash
psql -U postgres -d employee_leave_db -f database/schema.sql
```

The schema creates `employees` and `leave_requests`, including the foreign key, unique employee email, valid leave status constraint, and date-range constraint.

## Run

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The API is available at `http://localhost:5000` by default.

## API Documentation

All successful responses have the form `{ "success": true, "data": ... }`. Errors have the form `{ "success": false, "message": "..." }`.

### POST /employees

Creates a new employee.

Request body:

```json
{
  "name": "Vinit Sharma",
  "department": "Computer Engineering",
  "email": "vinit@example.com"
}
```

Example request:

```bash
curl -X POST http://localhost:5000/employees -H "Content-Type: application/json" -d "{\"name\":\"Vinit Sharma\",\"department\":\"Computer Engineering\",\"email\":\"vinit@example.com\"}"
```

Example response (`201 Created`):

```json
{
  "success": true,
  "data": { "id": 1, "name": "Vinit Sharma", "department": "Computer Engineering", "email": "vinit@example.com" }
}
```

Status codes: `201` created, `400` invalid input or duplicate email, `500` server/database error.

### POST /leaves

Submits a leave request. New requests always receive `pending` status.

Request body:

```json
{
  "employee_id": 1,
  "leave_type": "casual",
  "from_date": "2026-09-10",
  "to_date": "2026-09-12"
}
```

Example request:

```bash
curl -X POST http://localhost:5000/leaves -H "Content-Type: application/json" -d "{\"employee_id\":1,\"leave_type\":\"casual\",\"from_date\":\"2026-09-10\",\"to_date\":\"2026-09-12\"}"
```

Example response (`201 Created`):

```json
{
  "success": true,
  "data": { "id": 1, "employee_id": 1, "leave_type": "casual", "from_date": "2026-09-10", "to_date": "2026-09-12", "status": "pending" }
}
```

Status codes: `201` created, `400` invalid input, `404` employee not found, `500` server/database error.

### GET /leaves

Lists leave requests. Both query parameters are optional: `employee_id` is a positive employee ID and `status` is `pending`, `approved`, or `rejected`.

Example requests:

```bash
curl http://localhost:5000/leaves
curl "http://localhost:5000/leaves?employee_id=1"
curl "http://localhost:5000/leaves?status=pending"
curl "http://localhost:5000/leaves?employee_id=1&status=approved"
```

Example response (`200 OK`):

```json
{
  "success": true,
  "data": [
    { "id": 1, "employee_id": 1, "leave_type": "casual", "from_date": "2026-09-10", "to_date": "2026-09-12", "status": "pending" }
  ]
}
```

Status codes: `200` successful request, `400` invalid filter, `500` server/database error.

### PATCH /leaves/:id/status

Approves or rejects an existing leave request. Only `approved` and `rejected` are accepted.

Request body:

```json
{ "status": "approved" }
```

Example request:

```bash
curl -X PATCH http://localhost:5000/leaves/1/status -H "Content-Type: application/json" -d "{\"status\":\"approved\"}"
```

Example response (`200 OK`):

```json
{
  "success": true,
  "data": { "id": 1, "employee_id": 1, "leave_type": "casual", "from_date": "2026-09-10", "to_date": "2026-09-12", "status": "approved" }
}
```

Status codes: `200` updated, `400` invalid ID or status, `404` leave request not found, `500` server/database error.

### GET /leaves/summary/:employee_id

Returns total approved leave days for one employee, grouped by leave type. Dates are counted inclusively; for example, 10 September through 12 September counts as 3 days.

Example request:

```bash
curl http://localhost:5000/leaves/summary/1
```

Example response (`200 OK`):

```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "summary": { "casual": 3, "sick": 2 }
  }
}
```

Status codes: `200` successful request, `400` invalid employee ID, `404` employee not found, `500` server/database error.
