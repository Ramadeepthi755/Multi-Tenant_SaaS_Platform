# HRM Portal Backend

A complete Enterprise Human Resource Management (HRM) Portal Backend built using Spring Boot. This project provides secure REST APIs for managing employees, departments, attendance, payroll, leave requests, holidays, notifications, documents, and more.

---

## Features

### Authentication & Security
- JWT Authentication
- Spring Security
- Role-Based Access Control (RBAC)
- Password Encryption (BCrypt)
- Protected REST APIs

### Company Management
- Create Company
- Update Company
- Delete Company
- View Company Details

### Department Management
- Department CRUD Operations
- Department Status Management

### Designation Management
- Designation CRUD Operations
- Department-wise Designations

### Employee Management
- Employee Registration
- Employee Profile
- Employee Status
- Employee Search
- Employee Dashboard

### Attendance Management
- Employee Check-In
- Employee Check-Out
- Attendance History
- Monthly Attendance

### Leave Management
- Apply Leave
- Approve Leave
- Reject Leave
- Leave History

### Payroll Management
- Salary Details
- Payroll Generation
- Payroll History

### Holiday Management
- Company Holiday Calendar
- Upcoming Holidays

### Document Management
- Upload Employee Documents
- Download Documents
- Delete Documents

### Notifications
- In-App Notifications
- Notification Status

### Dashboard
- Employee Statistics
- Department Statistics
- Attendance Summary
- Payroll Summary
- Upcoming Holidays

### Audit Logs
- User Activity Tracking
- System Audit Logs

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate

### Database
- MySQL

### Build Tool
- Maven

### API Testing
- Postman
- Swagger UI

### Authentication
- JWT Token

---

## Project Architecture

```
Controller
      │
      ▼
Service Interface
      │
      ▼
Service Implementation
      │
      ▼
Repository
      │
      ▼
MySQL Database
```

---

## Project Structure

```
src
 ├── controller
 ├── dto
 ├── entity
 ├── enums
 ├── exception
 ├── repository
 ├── security
 ├── service
 │     ├── interface
 │     └── implementation
 ├── config
 └── util
```

---

## Technologies Used

- Java 21
- Spring Boot
- Spring Security
- JWT
- Hibernate
- Spring Data JPA
- MySQL
- Maven
- Swagger
- Lombok

---

## REST APIs

### Authentication

```
POST   /api/auth/login
POST   /api/auth/register
```

### Company

```
GET
POST
PUT
DELETE
```

### Department

```
GET
POST
PUT
DELETE
```

### Designation

```
GET
POST
PUT
DELETE
```

### Employee

```
GET
POST
PUT
DELETE
```

### Attendance

```
GET
POST
PUT
DELETE
```

### Leave

```
GET
POST
PUT
DELETE
```

### Payroll

```
GET
POST
PUT
DELETE
```

### Holiday

```
GET
POST
PUT
DELETE
```

### Notification

```
GET
POST
PUT
DELETE
```

### Documents

```
Upload
Download
Delete
```

---

## Validation

- Bean Validation
- Request DTO Validation
- Global Exception Handling
- Custom Error Responses

---

## Security

- JWT Authentication
- Spring Security
- BCrypt Password Encryption
- Role-Based Authorization
- Secure REST APIs

---

## Database

MySQL Database

Tables include:

- users
- companies
- departments
- designations
- employees
- attendance
- leave_requests
- payroll
- holidays
- notifications
- employee_documents
- audit_logs

---

## Running the Project

### Clone Repository

```bash
git clone https://github.com/Ramadeepthi755/HRM-Portal-Backend.git
```

### Navigate to Project

```bash
cd HRM-Portal-Backend
```

### Configure Database

Update your `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hrm_portal
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Run Application

```bash
mvn spring-boot:run
```

Application runs at:

```
http://localhost:8087
```

---

## API Documentation

Swagger UI

```
http://localhost:8087/swagger-ui/index.html
```

---

## Future Enhancements

- React Frontend
- Email Notifications
- SMS Notifications
- AWS S3 File Storage
- Dashboard Charts
- PDF Reports
- Multi-Tenant HRM
- Docker Deployment
- CI/CD Pipeline

---

## Author

**Ramadeepthi Badireddy**

GitHub: https://github.com/Ramadeepthi755

---

## License

This project is developed for educational and portfolio purposes.