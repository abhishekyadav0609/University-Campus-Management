# University Campus Management System — API Documentation

## 1. Overview

This REST API is built using Node.js, Express.js, MongoDB, and Mongoose.

**Base URL:** `http://localhost:5000/api`

**Content-Type:** `application/json`

Protected endpoints require:

`Authorization: Bearer ACCESS_TOKEN`

## 2. User Roles

| Role | Permissions |
|---|---|
| Admin | Manage users, courses, sections, enrollments, attendance and announcements |
| Faculty | Access assigned academic resources, update assigned courses, mark attendance and create announcements |
| Student | Access personal enrollment and attendance information and view announcements |

## 3. Authentication APIs

### Register a student

- **Method:** POST
- **Endpoint:** `/auth/register`
- **Access:** Public

Request body:

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "password": "Password123",
  "department": "Computer Science",
  "studentId": "STU003"
}
```

The public registration endpoint only permits student registration. Password must contain at least 8 characters.

Success response: `201 Created`

Returns the registered user and access and refresh tokens.

### Login

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Access:** Public

Request:

```json
{
  "email": "admin@university.com",
  "password": "Password123"
}
```

Success response: `200 OK`

Returns user information, access token and refresh token.

### Refresh token

- **Method:** POST
- **Endpoint:** `/auth/refresh`
- **Access:** Public

Request:

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

Returns newly generated access and refresh tokens.

### Logout

- **Method:** POST
- **Endpoint:** `/auth/logout`
- **Access:** Authenticated users

Revokes the stored refresh token and increments the token version.

### Get current user

- **Method:** GET
- **Endpoint:** `/auth/me`
- **Access:** Authenticated users

Returns the logged-in user's profile.

### Update current user

- **Method:** PATCH
- **Endpoint:** `/auth/me`
- **Access:** Authenticated users

Request:

```json
{
  "name": "Updated Name",
  "department": "Computer Science"
}
```

Only `name` and `department` can be updated.

## 4. User Management APIs

All user management endpoints require administrator access.

### Get users

- **Method:** GET
- **Endpoint:** `/users`
- **Access:** Admin

Optional query parameters:

- `page` — page number
- `limit` — records per page
- `role` — filter by role
- `department` — filter by department
- `search` — search name or email

Example:

`GET /users?page=1&limit=10&role=student`

Returns users and pagination information.

### Create user

- **Method:** POST
- **Endpoint:** `/users`
- **Access:** Admin

Request:

```json
{
  "name": "New Faculty",
  "email": "newfaculty@university.com",
  "password": "Password123",
  "role": "faculty",
  "department": "Computer Science",
  "facultyId": "FAC003"
}
```

Allowed roles: `admin`, `faculty`, `student`.

### Update user

- **Method:** PATCH
- **Endpoint:** `/users/:id`
- **Access:** Admin

Request:

```json
{
  "name": "Updated Name",
  "department": "Computer Science",
  "isActive": true
}
```

### Delete user

- **Method:** DELETE
- **Endpoint:** `/users/:id`
- **Access:** Admin

Deletes the specified user.

## 5. Course APIs

All course endpoints require authentication.

### Get courses

- **Method:** GET
- **Endpoint:** `/courses`
- **Access:** Authenticated users

Optional query parameter: `department`.

Faculty users receive courses assigned to them.

### Create course

- **Method:** POST
- **Endpoint:** `/courses`
- **Access:** Admin

Request:

```json
{
  "code": "CS202",
  "title": "Data Structures",
  "description": "Core data structures",
  "credits": 4,
  "department": "Computer Science",
  "faculty": "FACULTY_USER_OBJECT_ID"
}
```

The faculty ID must belong to a faculty account.

### Update course

- **Method:** PATCH
- **Endpoint:** `/courses/:id`
- **Access:** Admin and faculty

Request:

```json
{
  "title": "Advanced Data Structures",
  "description": "Updated course description",
  "credits": 4
}
```

Faculty members can update only their assigned courses.

### Delete course

- **Method:** DELETE
- **Endpoint:** `/courses/:id`
- **Access:** Admin

Deletes the specified course.

### Course Enrollment Report

- **Method:** GET
- **Endpoint:** `/courses/enrollment-report`
- **Access:** Admin only

Returns the total number of enrolled students for each course.

Example response:

```json
{
  "