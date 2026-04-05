# Finance Dashboard Backend

A robust Node.js/Express backend for managing financial records with Role-Based Access Control (RBAC).

## Setup Instructions
1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment**: Create a `.env` file (see `.env.example`)
4. **Seed Database**: `npm run seed` (Creates test users and data)
5. **Start Server**: `npm run dev`

## Role Permissions
| Action                 | Viewer | Analyst | Admin |
| :---                   | :---:  | :---:   | :---: |
| View Records           | yes    | yes     | yes   |
| View Dashboard Summary | no     | yes     | yes   |
| Create/Edit/Delete     | no     | no      | yes   |

## Tech Stack
- **Node.js & Express**: Backend framework
- **MongoDB & Mongoose**: Database and modeling
- **JWT**: Authentication
- **Zod**: Schema validation
- **Bcrypt.js**: Password hashing

## Assumptions & Design Choices
- **Aggregation**: Used MongoDB Aggregation Pipelines for the summary API to ensure high performance with large datasets.
- **RBAC**: Implemented via a reusable middleware `authorize()` to keep routes clean.
- **Validation**: All incoming data is validated using Zod schemas before reaching controllers.

## API Endpoints

**Authentication**
* `POST /api/auth/login` - Login to receive JWT (Body: `email`, `password`)

**Financial Records** (Requires Bearer Token)
* `GET /api/records` - Get user's records (Supports query params: `?type=income&category=Food`)
* `POST /api/records` - Create a new record (Admin only)
* `PUT /api/records/:id` - Update a record (Admin only)
* `DELETE /api/records/:id` - Delete a record (Admin only)

**Dashboard & Analytics** (Requires Bearer Token)
* `GET /api/records/summary` - Get aggregated totals and category breakdown (Admin/Analyst only)