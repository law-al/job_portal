# Job Portal

A full-stack job portal application built with **Next.js** (frontend) and **Express.js** (backend), TypeScript, Prisma, PostgreSQL, and MongoDB. This platform enables companies to post jobs, manage recruitment pipelines, and allows job seekers to apply for positions with resume and document uploads.

## Features

### Authentication & Authorization

- User registration and login with JWT tokens
- OAuth authentication (Google)
- Email verification
- Password reset functionality
- Refresh token mechanism for secure session management
- Role-based access control (Job Seeker, Company Admin, HR, Recruiter, Interviewer)
- User status management (Active, Suspended, Blocked, Removed)

### Company Management

- Company registration with logo upload (Cloudinary)
- Team member invitation system via email
- Role management for team members
- Company profile updates
- Member suspension/unsuspension
- One company per user enforcement

### Job Management

- Create, update, and delete job postings
- Open/close job functionality
- Custom recruitment pipeline stages
- Job status management (Open/Close)
- Multiple job types (Full-time, Part-time, Remote, Hybrid, etc.)
- Experience level filtering
- Public job listings with pagination and filtering
- Similar jobs recommendations
- Job detail pages with slug-based routing

### Applications

- Job application submission with multi-step form
- Resume upload and management (AWS S3)
- Supporting documents upload
- Cover letter support
- Application status tracking (Applied, Screening, Shortlisted, Interview, Offer, Hired, Rejected, Withdrawn)
- Pipeline stage management
- Application assignment to team members
- My Applications page for job seekers
- Admin applications dashboard

### Document Management

- Resume upload and storage (AWS S3)
- Supporting documents upload
- Document retrieval and listing
- Document deletion
- File size validation (5MB max)
- Multiple file format support (PDF, DOCX, PNG, JPG, etc.)

---

## Tech Stack

### Frontend

| Layer                | Technology             |
| -------------------- | ---------------------- |
| **Framework**        | Next.js 16             |
| **Language**         | TypeScript             |
| **UI Library**       | React 19               |
| **Styling**          | Tailwind CSS           |
| **UI Components**    | shadcn/ui, Radix UI    |
| **Forms**            | React Hook Form + Zod  |
| **State Management** | React Query (TanStack) |
| **Authentication**   | NextAuth.js            |
| **HTTP Client**      | Axios, Fetch API       |
| **Notifications**    | Sonner                 |

### Backend

| Layer                | Technology         |
| -------------------- | ------------------ |
| **Runtime**          | Node.js            |
| **Framework**        | Express.js 5       |
| **Language**         | TypeScript         |
| **Primary Database** | PostgreSQL         |
| **Document Storage** | MongoDB            |
| **ORM**              | Prisma 7           |
| **ODM**              | Mongoose           |
| **Validation**       | Zod                |
| **Authentication**   | JWT (jsonwebtoken) |
| **Password Hashing** | bcrypt             |
| **File Upload**      | Multer             |
| **File Storage**     | AWS S3             |
| **Image Storage**    | Cloudinary         |
| **Email**            | Nodemailer         |
| **Logging**          | Winston            |

---

## Project Structure

```
Job Portal/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Database migrations
│   │   └── schema.prisma        # PostgreSQL schema
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route handlers
│   │   ├── exceptions/          # Custom error classes
│   │   ├── generated/           # Prisma generated client
│   │   ├── middlewares/         # Express middlewares
│   │   ├── models/              # Zod validation schemas
│   │   │   └── document/        # MongoDB document models
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   ├── oauth/               # OAuth strategies
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   ├── docker-compose.yaml      # Docker services
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── src/
    │   ├── app/                 # Next.js app directory
    │   │   ├── (main)/         # Main routes
    │   │   │   ├── (auth)/     # Authentication routes
    │   │   │   ├── (homepage)/ # Public pages
    │   │   │   └── admin/      # Admin dashboard
    │   │   ├── actions/        # Server actions
    │   │   └── api/            # API routes
    │   ├── components/          # React components
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Utilities and helpers
    │   └── types/              # TypeScript types
    ├── package.json
    └── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker (for PostgreSQL) or a PostgreSQL instance
- MongoDB instance (local or cloud)
- AWS S3 account (for file storage)
- Cloudinary account (for image uploads)
- SMTP server (for emails)
- Google OAuth credentials (optional, for OAuth)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   pnpm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   pnpm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/job_portal
   MONGO_URI=mongodb://localhost:27017/job_portal

   # JWT
   JWTsecret=your-super-secret-jwt-key

   # Email (SMTP)
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password

   # Cloudinary (for company logos)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # AWS S3 (for documents/resumes)
   AWS_ACCESS_KEY=your-aws-access-key
   AWS_SECRET_KEY=your-aws-secret-key
   AWS_REGION=your-aws-region
   AWS_BUCKET_NAME=your-bucket-name

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   Create a `.env.local` file in the `client` directory:

   ```env
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

5. **Start the databases**

   ```bash
   # PostgreSQL (if using Docker)
   docker compose up -d

   # MongoDB (if using Docker)
   docker run -d -p 27017:27017 mongo
   ```

6. **Run database migrations**

   ```bash
   cd backend
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

7. **Start the backend server**

   ```bash
   cd backend
   pnpm dev
   ```

   The API will be available at `http://localhost:5000`

8. **Start the frontend server**

   ```bash
   cd client
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3001`

---

## API Reference

Base URL: `/api/v1`

### Authentication Routes

| Method | Endpoint                 | Description               | Auth        |
| ------ | ------------------------ | ------------------------- | ----------- |
| POST   | `/auth/register`         | Register a new user       | No          |
| POST   | `/auth/register-company` | Register a company        | Yes         |
| POST   | `/auth/login`            | User login                | No          |
| POST   | `/auth/oauth`            | OAuth login (Google)      | No          |
| GET    | `/auth/verify`           | Verify email              | No          |
| GET    | `/auth/re-verify`        | Resend verification email | Yes         |
| POST   | `/auth/forgot-password`  | Request password reset    | No          |
| POST   | `/auth/reset-password`   | Reset password            | No          |
| GET    | `/auth/refresh/:tokenId` | Refresh access token      | No          |
| POST   | `/auth/logout`           | Logout user               | Yes         |
| POST   | `/auth/invite/:id`       | Invite user to company    | Yes (Admin) |
| GET    | `/auth/invite/check`     | Check invitation token    | No          |
| POST   | `/auth/accept`           | Accept invitation         | No          |
| GET    | `/auth/user`             | Get current user          | Yes         |

### Company Routes

| Method | Endpoint                              | Description         | Auth          |
| ------ | ------------------------------------- | ------------------- | ------------- |
| POST   | `/company/register`                   | Register a company  | Yes (Company) |
| GET    | `/company/find`                       | Get company details | Yes (Admin)   |
| GET    | `/company/:id/members`                | Get company members | Yes (Admin)   |
| GET    | `/company/:id/members/:memberId`      | Get specific member | Yes (Admin)   |
| PATCH  | `/company/:id/members/:memberId/role` | Change member role  | Yes (Admin)   |
| PUT    | `/company/:id/update`                 | Update company info | Yes (Admin)   |
| PATCH  | `/company/:id/change-logo`            | Update company logo | Yes (Admin)   |
| DELETE | `/company/:id/:memberId/delete`       | Remove member       | Yes (Admin)   |
| PATCH  | `/company/:id/:memberId/suspend`      | Suspend member      | Yes (Admin)   |
| PATCH  | `/company/:id/:memberId/unsuspend`    | Unsuspend member    | Yes (Admin)   |

### Job Routes

| Method | Endpoint                    | Description              | Auth           |
| ------ | --------------------------- | ------------------------ | -------------- |
| GET    | `/jobs/all`                 | Get all jobs (public)    | No             |
| GET    | `/jobs/:slug`               | Get job by slug (public) | No             |
| GET    | `/jobs/:id/fetch`           | Get all company jobs     | Yes            |
| GET    | `/jobs/:id/fetch/:slug`     | Get job by slug          | Yes            |
| GET    | `/jobs/:id/pipelines`       | Get company pipelines    | Yes            |
| GET    | `/jobs/:id/pipeline/stages` | Get pipeline stages      | Yes            |
| POST   | `/jobs/:id/create`          | Create a job             | Yes (Admin/HR) |
| PUT    | `/jobs/:id/edit/:slug`      | Update a job             | Yes (Admin/HR) |
| PATCH  | `/jobs/:id/close/:slug`     | Close a job              | Yes (Admin/HR) |
| PATCH  | `/jobs/:id/open/:slug`      | Open a job               | Yes (Admin/HR) |
| DELETE | `/jobs/:id/delete/:slug`    | Delete a job             | Yes (Admin/HR) |

### Application Routes

| Method | Endpoint            | Description        | Auth |
| ------ | ------------------- | ------------------ | ---- |
| POST   | `/application/send` | Submit application | Yes  |

### Document Routes

| Method | Endpoint                        | Description                 | Auth |
| ------ | ------------------------------- | --------------------------- | ---- |
| GET    | `/document/resumes`             | Get user's uploaded resumes | Yes  |
| POST   | `/document/resume`              | Upload resume               | Yes  |
| POST   | `/document/supporting-document` | Upload supporting document  | Yes  |
| DELETE | `/document/:id`                 | Delete document             | Yes  |

---

## Database Schema

### Core Models (PostgreSQL - Prisma)

- **User** - User accounts with roles and verification status
- **Company** - Company profiles with branding
- **UserCompany** - Many-to-many relationship between users and companies
- **Invitation** - Company team invitations
- **Job** - Job postings with details and status
- **PipelineStage** - Custom recruitment pipeline stages per job
- **Application** - Job applications with status tracking

### Document Models (MongoDB - Mongoose)

- **Document** - Resume and supporting document storage

### Enums

- **UserRole**: `USER`, `COMPANY`
- **CompanyRole**: `ADMIN`, `HR`, `RECRUITER`, `INTERVIEWER`, `OTHER`
- **UserCompanyStatus**: `ACTIVE`, `SUSPENDED`, `REMOVED`, `BLOCKED`
- **JobType**: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `TEMPORARY`, `SEASONAL`, `REMOTE`, `HYBRID`, `IN_OFFICE`, `FREELANCE`, `VOLUNTEER`, `CONSULTANT`
- **JobStatus**: `OPEN`, `CLOSE`
- **ExperienceLevel**: `INTERN`, `ENTRY`, `JUNIOR`, `MID`, `SENIOR`, `LEAD`
- **ApplicationStatus**: `APPLIED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`, `WITHDRAWN`
- **InvitationStatus**: `PENDING`, `ACCEPTED`, `EXPIRED`, `CANCELLED`

---

## Scripts

### Backend

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `pnpm dev`                | Start development server with hot reload |
| `pnpm build`              | Compile TypeScript to JavaScript         |
| `pnpm start`              | Start production server                  |
| `pnpm lint`               | Run ESLint                               |
| `pnpm prisma migrate dev` | Run database migrations                  |
| `pnpm prisma generate`    | Generate Prisma client                   |
| `pnpm prisma studio`      | Open Prisma Studio GUI                   |

### Client

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

---

## Environment Variables

### Backend

| Variable                | Description                  | Required                  |
| ----------------------- | ---------------------------- | ------------------------- |
| `PORT`                  | Server port                  | No (default: 3000)        |
| `NODE_ENV`              | Environment mode             | No (default: development) |
| `DATABASE_URL`          | PostgreSQL connection string | Yes                       |
| `MONGO_URI`             | MongoDB connection string    | Yes                       |
| `JWTsecret`             | JWT signing secret           | Yes                       |
| `SMTP_HOST`             | SMTP server host             | Yes                       |
| `SMTP_USER`             | SMTP username                | Yes                       |
| `SMTP_PASS`             | SMTP password                | Yes                       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | Yes                       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           | Yes                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        | Yes                       |
| `AWS_ACCESS_KEY`        | AWS access key               | Yes                       |
| `AWS_SECRET_KEY`        | AWS secret key               | Yes                       |
| `AWS_REGION`            | AWS region                   | Yes                       |
| `AWS_BUCKET_NAME`       | AWS S3 bucket name           | Yes                       |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID       | Optional                  |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret   | Optional                  |

### Client

| Variable          | Description       | Required |
| ----------------- | ----------------- | -------- |
| `NEXTAUTH_URL`    | NextAuth base URL | Yes      |
| `NEXTAUTH_SECRET` | NextAuth secret   | Yes      |

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

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Company membership verification middleware
- User status checks (Active, Suspended, Blocked)
- One company per user enforcement
- File upload validation and size limits
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
