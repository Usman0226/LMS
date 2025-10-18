# LMS API Documentation

## Base URL
```
http://localhost:3000
```

## API Routes
All API endpoints are prefixed with `/api/`

---

## Authentication Endpoints (`/api/auth`)

### Register User
**POST** `/api/auth/register`

**Description:** Register a new user (student/teacher)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Login User
**POST** `/api/auth/login`

**Description:** Authenticate user and get JWT token

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

**Cookie:** Sets `token` cookie for authentication

---

### Logout User
**POST** `/api/auth/logout`

**Description:** Logout user and clear authentication cookie

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Course Endpoints (`/api/courses`)

### Create Course
**POST** `/api/courses/create`

**Description:** Create a new course (Teacher only)

**Headers:**
```
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Mathematics 101",
  "description": "Basic mathematics course",
  "duration": "6 months",
  "teacher": "teacher_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "course_id",
    "title": "Mathematics 101",
    "description": "Basic mathematics course",
    "duration": "6 months",
    "teacher": "teacher_id"
  }
}
```

---

### Get All Courses
**GET** `/api/courses/getCourses`

**Description:** Get all available courses

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "course_id",
      "title": "Mathematics 101",
      "description": "Basic mathematics course",
      "duration": "6 months",
      "teacher": {
        "_id": "teacher_id",
        "name": "Teacher Name"
      }
    }
  ]
}
```

---

## Enrollment Endpoints (`/api/enrollments`)

### Enroll in Course
**POST** `/api/enrollments/enroll`

**Description:** Enroll student in a course

**Headers:**
```
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "courseId": "course_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "_id": "enrollment_id",
    "student": "student_id",
    "course": "course_id"
  }
}
```

---

### Get My Enrollments
**GET** `/api/enrollments/my-courses`

**Description:** Get courses enrolled by current student

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "enrollment_id",
      "course": {
        "_id": "course_id",
        "title": "Mathematics 101",
        "description": "Basic mathematics course",
        "duration": "6 months"
      }
    }
  ]
}
```

---

### Get Enrolled Students
**GET** `/api/enrollments/:courseId/students`

**Description:** Get all students enrolled in a course (Teacher only)

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "enrollment_id",
      "student": {
        "_id": "student_id",
        "name": "Student Name",
        "email": "student@example.com"
      }
    }
  ]
}
```

---

## Assignment Endpoints (`/api/assignments`)

### Create Assignment
**POST** `/api/assignments/create`

**Description:** Create a new assignment (Teacher only)

**Headers:**
```
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "courseId": "course_id",
  "title": "Assignment 1",
  "description": "Complete the math problems",
  "dueDate": "2024-02-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "_id": "assignment_id",
    "course": "course_id",
    "title": "Assignment 1",
    "description": "Complete the math problems",
    "dueDate": "2024-02-15T23:59:59Z"
  }
}
```

---

### Get Course Assignments
**GET** `/api/assignments/:courseId`

**Description:** Get all assignments for a specific course

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "assignment_id",
      "course": "course_id",
      "title": "Assignment 1",
      "description": "Complete the math problems",
      "dueDate": "2024-02-15T23:59:59Z"
    }
  ]
}
```

---

## Submission Endpoints (`/api/submissions`)

### Submit Assignment
**POST** `/api/submissions/submit-assign`

**Description:** Submit assignment (Student only)

**Headers:**
```
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "assignmentId": "assignment_id",
  "submissionText": "My assignment submission...",
  "fileUrl": "https://example.com/file.pdf" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "_id": "submission_id",
    "student": "student_id",
    "assignment": "assignment_id",
    "submissionText": "My assignment submission...",
    "submittedAt": "2024-02-10T10:30:00Z"
  }
}
```

---

### Get Course Submissions
**GET** `/api/submissions/course/:courseId`

**Description:** Get all submissions for a course (Teacher only)

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_id",
      "student": {
        "_id": "student_id",
        "name": "Student Name"
      },
      "assignment": {
        "_id": "assignment_id",
        "title": "Assignment 1"
      },
      "submissionText": "Student's submission...",
      "submittedAt": "2024-02-10T10:30:00Z"
    }
  ]
}
```

---

### Get My Submissions
**GET** `/api/submissions/my-submission`

**Description:** Get current student's submissions

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_id",
      "assignment": {
        "_id": "assignment_id",
        "title": "Assignment 1"
      },
      "submissionText": "My submission...",
      "submittedAt": "2024-02-10T10:30:00Z"
    }
  ]
}
```

---

## Grade Endpoints (`/api/grades`)

### Grade Submission
**POST** `/api/grades/assign-grade`

**Description:** Grade a student submission (Teacher only)

**Headers:**
```
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "submissionId": "submission_id",
  "marks": 85,
  "feedback": "Great work on this assignment!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Grade submitted successfully",
  "data": {
    "_id": "grade_id",
    "submission": "submission_id",
    "student": "student_id",
    "marks": 85,
    "feedback": "Great work on this assignment!",
    "gradedAt": "2024-02-11T14:30:00Z"
  }
}
```

---

### Get Student Overall Grade
**GET** `/api/grades/student/:studentId/overall`

**Description:** Get student's overall grade across all courses

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": "student_id",
    "totalAssignments": 5,
    "gradedAssignments": 4,
    "overallPercentage": 87.5,
    "overallGrade": "B",
    "courseBreakdown": [
      {
        "courseTitle": "Mathematics 101",
        "assignments": [
          {
            "assignmentTitle": "Assignment 1",
            "marks": 90,
            "feedback": "Excellent work!"
          }
        ],
        "totalMarks": 90,
        "totalPossible": 100,
        "percentage": 90,
        "grade": "A"
      }
    ]
  }
}
```

---

### Get Course Overall Grades
**GET** `/api/grades/course/:courseId/overall`

**Description:** Get overall grades for all students in a course (Teacher only)

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "courseTitle": "Mathematics 101",
    "totalStudents": 3,
    "totalAssignments": 2,
    "students": [
      {
        "studentId": "student_id_1",
        "studentName": "Student 1",
        "studentEmail": "student1@example.com",
        "assignmentsCompleted": 2,
        "totalAssignments": 2,
        "overallPercentage": 92.5,
        "overallGrade": "A"
      }
    ]
  }
}
```

---

### Get Student Course Grades
**GET** `/api/grades/course/:courseId/student/:studentId`

**Description:** Get student's grades for a specific course

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "courseTitle": "Mathematics 101",
    "studentId": "student_id",
    "assignments": [
      {
        "assignmentId": "assignment_id",
        "assignmentTitle": "Assignment 1",
        "marks": 85,
        "feedback": "Good work!",
        "gradedAt": "2024-02-11T14:30:00Z",
        "status": "graded"
      }
    ]
  }
}
```

---

### Get Student Assignment Grade
**GET** `/api/grades/assignment/:assignmentId/student/:studentId`

**Description:** Get student's grade for a specific assignment

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Response (Not Submitted):**
```json
{
  "success": true,
  "data": {
    "assignmentId": "assignment_id",
    "assignmentTitle": "Assignment 1",
    "studentId": "student_id",
    "submissionStatus": "not_submitted",
    "gradeStatus": "not_submitted",
    "marks": null,
    "feedback": null,
    "gradedAt": null
  }
}
```

**Response (Submitted, Not Graded):**
```json
{
  "success": true,
  "data": {
    "assignmentId": "assignment_id",
    "assignmentTitle": "Assignment 1",
    "studentId": "student_id",
    "submissionStatus": "submitted",
    "gradeStatus": "pending",
    "marks": null,
    "feedback": null,
    "gradedAt": null,
    "submittedAt": "2024-02-10T10:30:00Z"
  }
}
```

**Response (Graded):**
```json
{
  "success": true,
  "data": {
    "_id": "grade_id",
    "marks": 85,
    "feedback": "Great work!",
    "gradedAt": "2024-02-11T14:30:00Z",
    "submission": {
      "assignment": {
        "title": "Assignment 1"
      }
    }
  }
}
```

---

## User Endpoints (`/api/users`)

*Note: Additional user management endpoints may be available*

---

## Authentication

Most endpoints (except `/api/auth/register` and `/api/auth/login`) require authentication via JWT token in cookie.

**Cookie Format:**
```
token=YOUR_JWT_TOKEN
```

**Role-based Access:**
- **Student:** Can view own data, submit assignments, view own grades
- **Teacher:** Can manage courses, assignments, submissions, grades
- **Admin:** Full access to all features

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Data Types

- **ObjectId:** MongoDB ObjectId (24-character hexadecimal string)
- **Date:** ISO 8601 date string
- **Email:** Valid email address format
- **URL:** Valid HTTP/HTTPS URL

---

*This API documentation is automatically generated and may be updated as new endpoints are added.*
