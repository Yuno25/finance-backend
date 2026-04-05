# Finance Data Processing and Access Control Backend

A backend API for a finance dashboard system where users can manage
financial records based on their role. Built with Node.js, Express,
and MongoDB.

## Live URLs

API: https://finance-backend-a964.onrender.com
Swagger Docs: https://finance-backend-a964.onrender.com/api-docs

---

## What's Used and Why

**Node.js + Express** — handles all the routing and request/response logic
**MongoDB + Mongoose** — stores users and financial records, Mongoose
handles schema definition and validation at the model level
**JWT (jsonwebtoken)** — used for authentication, every protected route
checks for a valid token before doing anything
**bcryptjs** — hashes passwords before storing them so plain text
passwords never touch the database
**express-validator** — validates incoming request data and returns
clear error messages if something is missing or wrong
**swagger-ui-express** — auto-generates interactive API documentation
from comments in the route files, accessible at /api-docs

## How It Works

There are two core models:

**User** — stores name, email, hashed password, role (viewer/analyst/admin),
and active status.

**FinancialRecord** — stores amount, type (income or expense), category,
date, notes, a reference to the user who created it, and an isDeleted
flag for soft delete.

When a request comes in to a protected route, it goes through two
middleware layers:

1. **auth.js** — checks the Authorization header for a Bearer token,
   verifies it, and attaches the user to the request object
2. **rbac.js** — checks if the attached user's role is allowed to
   perform that action. If not, returns a 403.

This means the controllers stay clean — they just handle the logic
and don't need to worry about who is allowed to be there.

The dashboard routes use MongoDB aggregation pipelines to calculate
totals, category breakdowns, and monthly/weekly trends directly at
the database level rather than fetching everything into memory.

## Roles and What They Can Do

| Action | Viewer | Analyst | Admin |
| ------ | ------ | ------- | ----- |

| View records : yes yes yes
| View dashboard: yes yes yes
| Create records: no yes yes
| Update records: no yes yes
| Delete records: no no yes
| Manage users : no no yes

## How to Use (Live API via Swagger)

1. Go to https://finance-backend-a964.onrender.com/api-docs
2. Use **POST /api/auth/register** to create a user
   - Set role to `admin` for full access
3. Use **POST /api/auth/login** and copy the token from the response
4. Click the **Authorize** button at the top right of the Swagger page
5. Enter `Bearer your_token_here` and confirm
6. All protected routes are now accessible from Swagger directly

## How to Run Locally

```bash
git clone https://github.com/your-username/finance-backend.git
cd finance-backend
npm install
```

# create a `.env` file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the server:

```bash
npm run dev
```

API will be running at `http://localhost:5000`
Swagger docs at `http://localhost:5000/api-docs

## API Endpoints

### Auth (public)

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login and get token |

### Users (admin only)

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | /api/users            | Get all users               |
| GET    | /api/users/:id        | Get single user             |
| PATCH  | /api/users/:id/role   | Update user role            |
| PATCH  | /api/users/:id/status | Activate or deactivate user |
| DELETE | /api/users/:id        | Delete user                 |

### Financial Records

| Method | Endpoint         | Access         |
| ------ | ---------------- | -------------- |
| GET    | /api/records     | All roles      |
| GET    | /api/records/:id | All roles      |
| POST   | /api/records     | Admin, Analyst |
| PUT    | /api/records/:id | Admin, Analyst |
| DELETE | /api/records/:id | Admin only     |

### Filtering Records

Add query parameters to GET /api/records:

- `?type=income` or `?type=expense`
- `?category=Salary`
- `?startDate=2024-01-01&endDate=2024-12-31`
- `?page=1&limit=10`

### Dashboard (all roles)

| Method | Endpoint                      | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| GET    | /api/dashboard/summary        | Total income, expenses, net balance |
| GET    | /api/dashboard/categories     | Totals grouped by category          |
| GET    | /api/dashboard/trends/monthly | Monthly breakdown                   |
| GET    | /api/dashboard/trends/weekly  | Weekly breakdown                    |
| GET    | /api/dashboard/recent         | Last 10 records                     |
