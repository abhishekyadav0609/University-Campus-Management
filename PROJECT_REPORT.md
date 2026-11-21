# UNIVERSITY CAMPUS MANAGEMENT SYSTEM
## Backend Development Capstone Project Report

**Submitted by:** [Your Name]  
**Course:** [Course Name / BCA]  
**College/University:** [College Name]  
**Subject:** Backend Development  
**Submitted to:** [Faculty Name]  
**Academic Year:** 2026–2027  
**Submission Date:** [Date]

---

## 1. Abstract

The University Campus Management System is a backend application developed using Node.js, Express.js and MongoDB. The main purpose of this project is to simplify and manage university operations through RESTful APIs.

The system provides functionality for user authentication, student and faculty management, course management, section management, student enrollment, attendance tracking and announcements.

It also includes role-based access control, JWT authentication, database aggregation, indexing and real-time notifications using Socket.IO.

The project aims to provide a centralized, secure and efficient platform for managing university academic activities.

## 2. Introduction

Managing university activities manually can be time-consuming and difficult. Maintaining student records, attendance, course information and announcements separately may result in errors and inefficient communication.

The University Campus Management System provides a centralized backend solution for these activities.

The application follows a modular architecture and uses REST APIs to communicate with clients.

## 3. Problem Statement

Traditional campus management processes may involve manual record maintenance and disconnected systems.

This can lead to:
- Difficulty managing student and faculty information.
- Errors in attendance records.
- Complicated course and enrollment management.
- Delays in communicating announcements.
- Difficulty generating academic reports.

This project addresses these problems by providing a centralized backend management system.

## 4. Objectives

The main objectives are:

1. Develop a RESTful backend using Node.js and Express.js.
2. Store and manage university information using MongoDB.
3. Implement secure authentication using JWT.
4. Provide role-based access for administrators, faculty and students.
5. Manage courses, sections and student enrollments.
6. Record and calculate student attendance.
7. Generate academic reports using MongoDB aggregation.
8. Provide real-time notifications using Socket.IO.
9. Implement database indexing for efficient queries.

## 5. Scope of the Project

The system supports three major user roles.

### Administrator
- Manage university users.
- Create and manage courses.
- Create and manage sections.
- Assign faculty to courses and sections.
- Manage student enrollments.
- Publish university announcements.
- Access academic reports.

### Faculty
- View assigned courses and sections.
- Mark student attendance.
- View attendance information.
- Publish announcements.

### Student
- Access enrolled courses.
- View personal enrollment information.
- View attendance records.
- Receive announcements and real-time updates.

## 6. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | Database object modeling |
| JavaScript | Backend programming |
| JWT | Authentication |
| bcrypt | Password hashing |
| Socket.IO | Real-time communication |
| dotenv | Environment configuration |
| Morgan | HTTP request logging |
| CORS | Cross-origin resource sharing |
| VS Code | Development environment |
| PowerShell | API testing |

## 7. System Architecture

The project follows a modular MVC-style backend architecture.

The main components are:

1. **Routes:** Define API endpoints.
2. **Controllers:** Handle application logic and requests.
3. **Models:** Define MongoDB schemas using Mongoose.
4. **Middleware:** Handle authentication, authorization and errors.
5. **Configuration:** Manage database and Socket.IO connections.
6. **Utilities:** Handle shared application events.

### Request Flow

Client → Express Routes → Middleware → Controller → Mongoose Model → MongoDB → Response

## 8. Database Design

The application uses MongoDB as its database.

The main collections include:

### User
Stores administrator, faculty and student information.

Important fields:
- Name
- Email
- Password hash
- Role
- Department
- Student ID
- Faculty ID
- Account status

### Course
Stores course information:
- Course code
- Course title
- Description
- Credits
- Department
- Faculty reference

### Section
Stores academic section information:
- Section name
- Course reference
- Faculty reference
- Semester
- Academic year

### Enrollment
Stores student enrollment information:
- Student reference
- Course reference
- Section reference

### Attendance
Stores attendance records:
- Student reference
- Course reference
- Section reference
- Date
- Attendance status

### Announcement
Stores university and academic announcements:
- Title
- Message
- Audience
- Creator reference
- Section/course information where applicable

### Database Relationships
- One faculty member can be associated with multiple courses.
- A course can have multiple sections.
- Students enroll in courses through sections.
- Attendance records are associated with students and academic sections.
- Announcements can be published for different audiences.

## 9. Modules Implemented

### 9.1 Authentication Module
- User login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes.
- Role-based authorization.

### 9.2 User Management Module
- User listing.
- User management through protected APIs.
- Different access permissions for different roles.

### 9.3 Course Management Module
- Create, view, update and delete courses.
- Generate course enrollment reports.

### 9.4 Section Management Module
- Create, view, update and delete sections.
- Prevent deletion of sections with existing enrollments.
- Generate section summary reports.

### 9.5 Enrollment Module
- Enroll students into courses and sections.
- View student enrollments.
- Validate student, course and section references.

### 9.6 Attendance Module
- Mark student attendance.
- View personal attendance records.
- Generate attendance summaries.
- Calculate attendance percentages.
- Identify students with low attendance.

### 9.7 Announcement Module
- Create announcements.
- Publish university-wide announcements.
- Publish section-specific announcements.
- Retrieve and delete announcements.

### 9.8 Real-Time Notification Module
Socket.IO provides:
- Live attendance notifications.
- Live announcement notifications.
- Authenticated socket connections.

## 10. Authentication and Security

The project implements:
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected routes.
- Role-based authorization.
- Environment variables for sensitive configuration.
- Database reference validation.

The system distinguishes administrator, faculty and student permissions.

## 11. API Development

The backend provides RESTful API endpoints.

| Module | Base Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Users | `/api/users` |
| Courses | `/api/courses` |
| Sections | `/api/sections` |
| Enrollments | `/api/enrollments` |
| Attendance | `/api/attendance` |
| Announcements | `/api/announcements` |

Examples:
- `POST /api/auth/login`
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/enrollment-report`
- `GET /api/sections`
- `PATCH /api/sections/:id`
- `DELETE /api/sections/:id`
- `GET /api/sections/summary-report`
- `GET /api/enrollments/mine`
- `GET /api/attendance/mine`
- `GET /api/announcements`

The API uses HTTP status codes such as 200, 201, 400, 401, 403, 404 and 409.

## 12. MongoDB Aggregation and Indexing

Four aggregation-based operations are implemented:
1. Attendance summary report.
2. Low attendance report.
3. Course enrollment report.
4. Section summary report.

Database indexes improve query performance and help maintain data consistency.

Examples include:
- Unique index on user email.
- Sparse unique index on student ID.
- Unique index on course code.
- Compound index on user role and department.
- Compound index on course department and title.

## 13. Real-Time Communication

The project uses EventEmitter and Socket.IO.

The EventEmitter generates application events when attendance is marked or announcements are created.

Socket.IO delivers these updates to connected clients.

The following events were tested:
- `attendance:updated`
- `announcement:new`

Successful live attendance and announcement notifications were received during testing.

## 14. Testing and Validation

API testing was performed using Windows PowerShell and HTTP requests.

| Test Case | Expected Result | Status |
|---|---|---|
| Administrator login | Successful login | Passed |
| Student login | Successful login | Passed |
| Retrieve courses | Course data returned | Passed |
| Retrieve sections | Section data returned | Passed |
| Student enrollment lookup | Enrollment data returned | Passed |
| Mark attendance | Attendance saved | Passed |
| Attendance summary | Correct summary returned | Passed |
| Low attendance report | Report returned | Passed |
| Create announcement | Announcement created | Passed |
| Student creates restricted announcement | 403 Forbidden | Passed |
| Student accesses course enrollment report | 403 Forbidden | Passed |
| Student accesses section summary report | 403 Forbidden | Passed |
| Delete section with enrollment | 409 Conflict | Passed |
| Live attendance notification | Notification received | Passed |
| Live announcement notification | Notification received | Passed |

Testing confirmed that the major implemented APIs and role-based restrictions work as expected.

## 15. Error Handling

Centralized error-handling middleware handles:
- Validation errors.
- Duplicate database records.
- Invalid database IDs.
- Missing routes.
- Unauthorized access.
- Internal server errors.

The application returns structured JSON responses.

## 16. Advantages

- Centralized academic information management.
- Secure authentication and authorization.
- Efficient attendance tracking.
- Easy course and enrollment management.
- Real-time notifications.
- Automated academic reports.
- Modular and maintainable backend structure.
- Database indexing for query efficiency.

## 17. Limitations

- The current project focuses primarily on backend functionality.
- A complete production frontend is outside the current implementation scope.
- Real-world deployment and large-scale performance testing are not covered.
- Additional security hardening is required before production deployment.

## 18. Future Enhancements

1. Responsive web frontend.
2. Student and faculty dashboards.
3. Online fee payment integration.
4. Timetable management.
5. Examination and result management.
6. Email and SMS notifications.
7. Cloud deployment.
8. Advanced analytics and visualization.

## 19. Conclusion

The University Campus Management System demonstrates the development of a modular backend application using Node.js, Express.js and MongoDB.

The project implements authentication, role-based access control, academic management, enrollment, attendance tracking, announcements, aggregation reports and real-time notifications.

It provides practical experience in backend development, REST API design, database management, security and real-time communication.

The project meets the major functional objectives of the proposed university management backend and provides a foundation for future enhancements.

## 20. References

1. Node.js Documentation – https://nodejs.org/docs/
2. Express.js Documentation – https://expressjs.com/
3. MongoDB Documentation – https://www.mongodb.com/docs/
4. Mongoose Documentation – https://mongoosejs.com/docs/
5. Socket.IO Documentation – https://socket.io/docs/
6. JSON Web Token – https://jwt.io/

---

**END OF PROJECT REPORT**