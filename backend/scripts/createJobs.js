/**
 * Script to create multiple jobs for testing purposes
 *
 * Usage:
 *   node scripts/createJobs.js <companyId> <accessToken> [count]
 *
 * Example:
 *   node scripts/createJobs.js "your-company-id" "your-access-token" 50
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Sample job data templates
const jobTemplates = [
  {
    title: 'Senior Software Engineer',
    description:
      'We are looking for an experienced software engineer to join our team. You will be responsible for designing and developing scalable web applications using modern technologies.',
    location: 'San Francisco, CA',
    salary_range: '$120,000 - $180,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    isRemote: false,
    slot: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    pipelineName: 'Engineering Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Screen', order: 1 },
      { name: 'Technical Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'Frontend Developer',
    description: 'Join our frontend team to build beautiful and responsive user interfaces. Experience with React, TypeScript, and modern CSS is required.',
    location: 'New York, NY',
    salary_range: '$90,000 - $130,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    isRemote: true,
    slot: 3,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Engineering Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Screen', order: 1 },
      { name: 'Technical Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'Product Manager',
    description: 'Lead product development initiatives and work closely with engineering and design teams to deliver exceptional products.',
    location: 'Austin, TX',
    salary_range: '$110,000 - $160,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    isRemote: false,
    slot: 1,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Product Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Initial Review', order: 1 },
      { name: 'Product Interview', order: 2 },
      { name: 'Case Study', order: 3 },
      { name: 'Final Interview', order: 4 },
      { name: 'Offer', order: 5 },
    ],
  },
  {
    title: 'UX Designer',
    description: 'Create intuitive and engaging user experiences. You will work on user research, wireframing, prototyping, and design systems.',
    location: 'Seattle, WA',
    salary_range: '$85,000 - $125,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    isRemote: true,
    slot: 2,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Design Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Portfolio Review', order: 1 },
      { name: 'Design Challenge', order: 2 },
      { name: 'Team Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'DevOps Engineer',
    description: 'Manage cloud infrastructure, CI/CD pipelines, and ensure system reliability. Experience with AWS, Docker, and Kubernetes required.',
    location: 'Remote',
    salary_range: '$100,000 - $150,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    isRemote: true,
    slot: 1,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Engineering Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Screen', order: 1 },
      { name: 'Technical Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex datasets and build machine learning models to drive business decisions. Python, SQL, and ML frameworks experience required.',
    location: 'Boston, MA',
    salary_range: '$115,000 - $170,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    isRemote: false,
    slot: 2,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Data Science Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Resume Review', order: 1 },
      { name: 'Technical Assessment', order: 2 },
      { name: 'Team Interview', order: 3 },
      { name: 'Final Interview', order: 4 },
      { name: 'Offer', order: 5 },
    ],
  },
  {
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to grow brand awareness and drive customer acquisition.',
    location: 'Chicago, IL',
    salary_range: '$75,000 - $110,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    isRemote: false,
    slot: 1,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Marketing Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Initial Screening', order: 1 },
      { name: 'Marketing Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'Sales Representative',
    description: 'Build relationships with clients and drive revenue growth. Strong communication skills and sales experience required.',
    location: 'Los Angeles, CA',
    salary_range: '$60,000 - $90,000 + Commission',
    jobType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    isRemote: false,
    slot: 5,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Sales Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Interview', order: 1 },
      { name: 'Role Play Assessment', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'Backend Developer',
    description: 'Design and implement robust backend systems using Node.js, Python, or Java. Experience with databases and APIs required.',
    location: 'Denver, CO',
    salary_range: '$95,000 - $140,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    isRemote: true,
    slot: 2,
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Engineering Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Screen', order: 1 },
      { name: 'Technical Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
  {
    title: 'QA Engineer',
    description: 'Ensure product quality through comprehensive testing. Experience with automated testing frameworks and bug tracking systems.',
    location: 'Portland, OR',
    salary_range: '$70,000 - $100,000',
    jobType: 'FULL_TIME',
    experienceLevel: 'JUNIOR',
    isRemote: true,
    slot: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineName: 'Engineering Pipeline',
    pipelineStages: [
      { name: 'Applied', order: 0 },
      { name: 'Phone Screen', order: 1 },
      { name: 'Technical Interview', order: 2 },
      { name: 'Final Interview', order: 3 },
      { name: 'Offer', order: 4 },
    ],
  },
];

// Additional job titles for variety
const additionalTitles = [
  'Full Stack Developer',
  'Mobile App Developer',
  'Cloud Architect',
  'Security Engineer',
  'Business Analyst',
  'Project Manager',
  'Content Writer',
  'Graphic Designer',
  'HR Manager',
  'Financial Analyst',
  'Customer Success Manager',
  'Operations Manager',
  'Business Development Representative',
  'Account Executive',
  'Technical Writer',
  'System Administrator',
  'Network Engineer',
  'Database Administrator',
  'Machine Learning Engineer',
  'AI Research Scientist',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
  'Denver, CO',
  'Portland, OR',
  'Remote',
  'Miami, FL',
  'Atlanta, GA',
  'Dallas, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
];

const experienceLevels = ['INTERN', 'ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];
const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomJob(template, index) {
  const title = index < additionalTitles.length ? additionalTitles[index] : `${template.title} ${Math.floor(Math.random() * 100)}`;

  return {
    ...template,
    title,
    location: getRandomElement(locations),
    experienceLevel: getRandomElement(experienceLevels),
    jobType: getRandomElement(jobTypes),
    salary_range: generateSalaryRange(template.experienceLevel || 'MID'),
    isRemote: Math.random() > 0.5,
    slot: Math.floor(Math.random() * 5) + 1,
    deadline: new Date(Date.now() + (Math.floor(Math.random() * 60) + 10) * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function generateSalaryRange(experienceLevel) {
  const ranges = {
    INTERN: ['$20,000', '$35,000'],
    ENTRY: ['$50,000', '$75,000'],
    JUNIOR: ['$60,000', '$85,000'],
    MID: ['$80,000', '$120,000'],
    SENIOR: ['$110,000', '$170,000'],
    LEAD: ['$140,000', '$220,000'],
  };

  const [min, max] = ranges[experienceLevel] || ranges.MID;
  return `${min} - ${max}`;
}

async function createJob(companyId, accessToken, jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${companyId}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to create job: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node scripts/createJobs.js <companyId> <accessToken> [count]');
    console.error('');
    console.error('Arguments:');
    console.error('  companyId    - Your company ID (UUID)');
    console.error('  accessToken  - Your authentication access token');
    console.error('  count        - Number of jobs to create (default: 20)');
    console.error('');
    console.error('Example:');
    console.error('  node scripts/createJobs.js "123e4567-e89b-12d3-a456-426614174000" "your-token-here" 50');
    process.exit(1);
  }

  const [companyId, accessToken, countStr] = args;
  const count = parseInt(countStr || '20', 10);

  if (isNaN(count) || count < 1) {
    console.error('Error: Count must be a positive number');
    process.exit(1);
  }

  console.log(`Creating ${count} jobs for company ${companyId}...\n`);

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < count; i++) {
    const template = jobTemplates[i % jobTemplates.length];
    const jobData = generateRandomJob(template, i);

    try {
      await createJob(companyId, accessToken, jobData);
      successCount++;
      process.stdout.write(`\r✓ Created ${successCount}/${count} jobs...`);
    } catch (error) {
      failCount++;
      errors.push({ index: i + 1, error: error.message, job: jobData.title });
      process.stdout.write(`\r✗ Failed to create job ${i + 1}: ${error.message}`);
    }

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n\n=== Summary ===');
  console.log(`✓ Successfully created: ${successCount} jobs`);
  console.log(`✗ Failed: ${failCount} jobs`);

  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(({ index, error, job }) => {
      console.log(`Job ${index} (${job}): ${error}`);
    });
  }

  console.log('\nDone!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
