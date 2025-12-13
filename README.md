# Job Portal

A full-stack job portal application built with Express.js, TypeScript, Prisma, and PostgreSQL. This platform enables companies to post jobs, manage recruitment pipelines, and allows job seekers to apply for positions.

## Features

### Authentication & Authorization

- User registration and login with JWT tokens
- Email verification
- Password reset functionality
- Role-based access control (Job Seeker, Company Admin, HR, Recruiter, Interviewer)

### Company Management

- Company registration with logo upload (Cloudinary)
- Team member invitation system via email
- Role management for team members
- Company profile updates

### Job Management

- Create, update, and delete job postings
- Custom recruitment pipeline stages
- Job status management (Open/Close)
- Multiple job types (Full-time, Part-time, Remote, Hybrid, etc.)
- Experience level filtering

### Applications

- Job application submission
- Application status tracking
- Pipeline stage management
- Resume and cover letter support

---

## Tech Stack

| Layer                | Technology          |
| -------------------- | ------------------- |
| **Runtime**          | Node.js             |
| **Framework**        | Express.js 5        |
| **Language**         | TypeScript          |
| **Database**         | PostgreSQL          |
| **ORM**              | Prisma 7            |
| **Validation**       | Zod                 |
| **Authentication**   | JWT (jsonwebtoken)  |
| **Password Hashing** | bcrypt              |
| **File Upload**      | Multer + Cloudinary |
| **Email**            | Nodemailer          |
| **Logging**          | Winston             |

---

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Route handlers
│   ├── exceptions/          # Custom error classes
│   ├── generated/           # Prisma generated client
│   ├── middlewares/         # Express middlewares
│   ├── models/              # Zod validation schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── docker-compose.yaml      # Docker services
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker (for PostgreSQL) or a PostgreSQL instance
- Cloudinary account (for image uploads)
- SMTP server (for emails)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install dependencies**

   ```bash
   cd backend
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/job_portal

   # JWT
   JWTsecret=your-super-secret-jwt-key

   # Email (SMTP)
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the database**

   ```bash
   docker compose up -d
   ```

5. **Run database migrations**

   ```bash
   pnpm prisma migrate dev
   ```

6. **Generate Prisma client**

   ```bash
   pnpm prisma generate
   ```

7. **Start the development server**

   ```bash
   pnpm dev
   ```

   The API will be available at `http://localhost:3000`

---

## API Reference

Base URL: `/api/v1`

### Authentication Routes

| Method | Endpoint                | Description               | Auth        |
| ------ | ----------------------- | ------------------------- | ----------- |
| POST   | `/auth/register`        | Register a new user       | No          |
| POST   | `/auth/login`           | User login                | No          |
| GET    | `/auth/verify`          | Verify email              | No          |
| GET    | `/auth/re-verify`       | Resend verification email | Yes         |
| POST   | `/auth/forgot-password` | Request password reset    | No          |
| POST   | `/auth/reset-password`  | Reset password            | No          |
| GET    | `/auth/access-token`    | Refresh access token      | No          |
| POST   | `/auth/invite/:id`      | Invite user to company    | Yes (Admin) |
| POST   | `/auth/accept`          | Accept invitation         | No          |

### Company Routes

| Method | Endpoint                        | Description         | Auth          |
| ------ | ------------------------------- | ------------------- | ------------- |
| POST   | `/company/register`             | Register a company  | Yes (Company) |
| GET    | `/company/:id`                  | Get company details | No            |
| GET    | `/company/:id/members`          | Get company members | Yes (Admin)   |
| POST   | `/company/:id/:memberId/role`   | Change member role  | Yes (Admin)   |
| PUT    | `/company/:id/update`           | Update company info | Yes (Admin)   |
| PATCH  | `/company/:id/change-logo`      | Update company logo | Yes (Admin)   |
| DELETE | `/company/:id/:memberId/delete` | Remove member       | Yes (Admin)   |

### Job Routes

| Method | Endpoint                 | Description          | Auth           |
| ------ | ------------------------ | -------------------- | -------------- |
| GET    | `/jobs/:id/fetch`        | Get all company jobs | Yes            |
| GET    | `/jobs/:id/fetch/:slug`  | Get job by slug      | Yes            |
| POST   | `/jobs/:id/create`       | Create a job         | Yes (Admin/HR) |
| PUT    | `/jobs/:id/edit/:slug`   | Update a job         | Yes (Admin/HR) |
| PATCH  | `/jobs/:id/close/:slug`  | Close a job          | Yes (Admin/HR) |
| DELETE | `/jobs/:id/delete/:slug` | Delete a job         | Yes (Admin/HR) |

---

## Database Schema

### Core Models

- **User** - User accounts with roles and verification status
- **Company** - Company profiles with branding
- **UserCompany** - Many-to-many relationship between users and companies
- **Invitation** - Company team invitations
- **Job** - Job postings with details and status
- **PipelineStage** - Custom recruitment pipeline stages per job
- **Application** - Job applications with status tracking

### Enums

- **UserRole**: `JOB_SEEKER`, `COMPANY`, `OTHER`
- **CompanyRole**: `COMPANY_ADMIN`, `HR`, `RECRUITER`, `INTERVIEWER`, `OTHER`
- **JobType**: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `REMOTE`, `HYBRID`, etc.
- **JobStatus**: `OPEN`, `CLOSE`
- **ExperienceLevel**: `INTERN`, `ENTRY`, `JUNIOR`, `MID`, `SENIOR`, `LEAD`
- **ApplicationStatus**: `APPLIED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`, `WITHDRAWN`

---

## Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `pnpm dev`                | Start development server with hot reload |
| `pnpm build`              | Compile TypeScript to JavaScript         |
| `pnpm start`              | Start production server                  |
| `pnpm lint`               | Run ESLint                               |
| `pnpm prisma migrate dev` | Run database migrations                  |
| `pnpm prisma generate`    | Generate Prisma client                   |
| `pnpm prisma studio`      | Open Prisma Studio GUI                   |

---

## Environment Variables

| Variable                | Description                  | Required                  |
| ----------------------- | ---------------------------- | ------------------------- |
| `PORT`                  | Server port                  | No (default: 3000)        |
| `NODE_ENV`              | Environment mode             | No (default: development) |
| `DATABASE_URL`          | PostgreSQL connection string | Yes                       |
| `JWTsecret`             | JWT signing secret           | Yes                       |
| `SMTP_HOST`             | SMTP server host             | Yes                       |
| `SMTP_USER`             | SMTP username                | Yes                       |
| `SMTP_PASS`             | SMTP password                | Yes                       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | Yes                       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           | Yes                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        | Yes                       |

---

## Error Handling

The API uses structured error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

Common HTTP status codes:

- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.
