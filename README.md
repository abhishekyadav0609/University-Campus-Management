# University Campus Management System

Backend capstone project built with Node.js, Express, MongoDB, Mongoose, JWT, bcrypt and Socket.IO.

## Features
- Student, faculty and administrator roles (RBAC)
- Student registration; administrator-created faculty/admin/student accounts
- Login, logout, JWT access and refresh token rotation
- User, course, section and enrollment CRUD
- Faculty attendance marking and student attendance summaries
- University/section/course announcements
- Socket.IO announcements and attendance notifications
- EventEmitter for decoupled application events
- MongoDB aggregation for attendance summaries and low-attendance reports
- Mongoose validation, unique indexes, pagination, centralized errors and request logging
- Seed data for demonstration

## Requirements
- Node.js 18 or newer
- MongoDB local installation or MongoDB Atlas account

## Setup
1. Extract the ZIP and open the project folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
   - PowerShell: `Copy-Item .env.example .env`
4. Put your MongoDB connection string in `MONGO_URI` in `.env`.
5. Change both JWT secrets to long random values.
6. Run `npm run seed` to create demo users and sample academic data.
7. Run `npm run dev`.
8. Open `http://localhost:5000/`.

All demo accounts use password `Password123`:
- admin@university.com
- faculty@university.com
- student1@university.com
- student2@university.com

## API quick reference
All endpoints are prefixed with `/api`. Send `Authorization: Bearer ACCESS_TOKEN` for protected endpoints and `Content-Type: application/json` for JSON requests.

### Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public student registration |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public, refresh token in body |
| POST | `/auth/logout` | Authenticated |
| GET | `/auth/me` | Authenticated |
| PATCH | `/auth/me` | Authenticated |

### Users (admin)
| Method | Endpoint |
|---|---|
| GET | `/users?page=1&limit=10&role=student` |
| POST | `/users` |
| PATCH | `/users/:id` |
| DELETE | `/users/:id` |

### Courses, sections and enrollment
| Method | Endpoint | Access |
|---|---|---|
| GET | `/courses` | Authenticated |
| POST | `/courses` | Admin |
| PATCH | `/courses/:id` | Admin/faculty |
| DELETE | `/courses/:id` | Admin |
| GET | `/sections` | Authenticated |
| POST | `/sections` | Admin |
| GET | `/enrollments/mine` | Authenticated |
| POST | `/enrollments` | Admin |
| DELETE | `/enrollments/:id` | Admin |

### Attendance and announcements
| Method | Endpoint | Access |
|---|---|---|
| POST | `/attendance/mark` | Admin/faculty |
| GET | `/attendance/mine` | Authenticated |
| GET | `/attendance/summary/:studentId` | Authenticated |
| GET | `/attendance/low?threshold=75` | Admin/faculty |
| GET | `/announcements` | Authenticated |
| POST | `/announcements` | Admin/faculty |
| DELETE | `/announcements/:id` | Admin |

## Example requests

### Login
`POST /api/auth/login`
```json
{ "email": "admin@university.com", "password": "Password123" }
```

### Create a course (admin)
`POST /api/courses`
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
Use the faculty user's MongoDB `_id` from `GET /api/users?role=faculty`.

### Create a section (admin)
`POST /api/sections`
```json
{
  "name": "B",
  "course": "COURSE_OBJECT_ID",
  "faculty": "FACULTY_USER_OBJECT_ID",
  "semester": "Semester 2",
  "academicYear": "2026-2027"
}
```

### Enroll a student (admin)
`POST /api/enrollments`
```json
{
  "student": "STUDENT_OBJECT_ID",
  "course": "COURSE_OBJECT_ID",
  "section": "SECTION_OBJECT_ID"
}
```

### Mark attendance (faculty/admin)
`POST /api/attendance/mark`
```json
{
  "section": "SECTION_OBJECT_ID",
  "date": "2026-11-21",
  "records": [
    { "student": "STUDENT_OBJECT_ID", "status": "present" },
    { "student": "ANOTHER_STUDENT_OBJECT_ID", "status": "absent" }
  ]
}
```

### Create announcement
`POST /api/announcements`
```json
{
  "title": "Class test",
  "message": "The class test will be held on Friday.",
  "audience": "section",
  "section": "SECTION_OBJECT_ID"
}
```

## Real-time events
Socket.IO client connection:
```js
const socket = io("http://localhost:5000", {
  auth: { token: "YOUR_ACCESS_TOKEN" }
});
socket.on("announcement:new", data => console.log(data));
socket.on("attendance:updated", data => console.log(data));
```
Faculty/student clients can join a section room using `socket.emit("join-section", sectionId)`. Socket connections require a valid access token.

## Aggregation pipelines and indexes
- Attendance summary: groups attendance by student and course and calculates percentage.
- Low attendance report: groups attendance, calculates percentage, filters below threshold and joins user/course details.
- Indexes: unique email/studentId/facultyId, course code, section/course/name/semester, enrollment student/course, attendance student/course/date, plus supporting query indexes.

## Testing checklist
Test at least:
1. Valid login and invalid password.
2. Public registration with missing fields / duplicate email.
3. Call protected endpoint without token (expect 401).
4. Student attempts admin-only user endpoint (expect 403).
5. Duplicate course code or duplicate enrollment (expect 409).
6. Mark attendance for a student not enrolled in that section (expect 400).
7. Faculty attempts to mark attendance for another faculty's section (expect 403).
8. Check attendance summary and low-attendance report.
9. Connect Socket.IO without token (connection should be rejected).
10. Create an announcement and verify the socket event.

## Notes
- This is an academic demonstration project. Use HTTPS and stronger secrets for deployment.
- The demo seed command clears existing users, courses, sections and enrollments in the selected database before inserting sample data. Do not run it against a database containing important data.
- For production use, add rate limiting, email verification, stronger refresh-token storage/rotation controls and audit logs.
