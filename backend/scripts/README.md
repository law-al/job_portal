# Job Creation Script

This script allows you to create multiple jobs for testing purposes.

## Prerequisites

1. Make sure your backend server is running on `http://localhost:5000`
2. You need:
   - A valid company ID (UUID)
   - A valid access token (from logging in as a company user with ADMIN or HR role)

## How to Get Your Credentials

1. **Company ID**:
   - Log in to your admin panel
   - Check your session or database for your company ID
   - Or check the URL when viewing company settings

2. **Access Token**:
   - Log in via the API or frontend
   - The access token is returned in the login response
   - For testing, you can also check your browser's network tab after logging in

## Usage

```bash
# Basic usage (creates 20 jobs by default)
node scripts/createJobs.js <companyId> <accessToken>

# Create specific number of jobs
node scripts/createJobs.js <companyId> <accessToken> <count>

# Examples
node scripts/createJobs.js "123e4567-e89b-12d3-a456-426614174000" "your-token-here"
node scripts/createJobs.js "123e4567-e89b-12d3-a456-426614174000" "your-token-here" 50
```

## What the Script Does

- Creates jobs with varied data:
  - Different job titles (Software Engineer, Product Manager, Designer, etc.)
  - Various locations (San Francisco, New York, Remote, etc.)
  - Different experience levels (INTERN, ENTRY, JUNIOR, MID, SENIOR, LEAD)
  - Different job types (FULL_TIME, PART_TIME, CONTRACT, etc.)
  - Random salary ranges based on experience level
  - Pipeline stages for each job
  - Various deadlines (10-60 days from now)

- Shows progress as it creates jobs
- Provides a summary of successful and failed creations
- Lists any errors encountered

## Notes

- The script includes a small delay (100ms) between requests to avoid overwhelming the server
- Jobs are created with realistic data but can be customized
- Make sure you have ADMIN or HR role in the company to create jobs
