import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AIEmployee from './models/AIEmployee.js';

// Load environment variables for local seeding
dotenv.config();

const employees = [
  {
    name: 'FullStack Pro AI',
    domain: 'software-development',
    roleTitle: 'Full Stack Developer AI',
    hourlyRate: 200, // ₹200 as per marketing site
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Authentication', 'Docker'],
    certifications: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', score: 'Passed', validFrom: new Date('2023-01-15') },
      { name: 'Meta React Professional', issuer: 'Meta', score: '98%', validFrom: new Date('2023-06-20') },
      { name: 'MongoDB Node.js Developer', issuer: 'MongoDB', score: '100%', validFrom: new Date('2023-11-05') },
    ],
    trustScore: 96,
    successRate: 97.8,
    tasksDone: 18420,
    experienceYears: 2.4,
    permissionsSupported: ['Read files', 'Modify files', 'Run tests', 'Git operations', 'Create PRs', 'Connect to DB (Dev)'],
    restrictions: ['No production access', 'No credential extraction', 'No destructive ops without approval', 'No external network calls (unlisted)'],
    illustrationKey: 'illustration_fullstack',
  },
  {
    name: 'Code Reviewer AI',
    domain: 'software-development',
    roleTitle: 'Senior Code Reviewer Agent',
    hourlyRate: 150,
    skills: ['Code Review', 'Static Analysis', 'Security Auditing', 'Performance Profiling', 'Clean Code', 'TypeScript', 'Python'],
    certifications: [
      { name: 'OWASP Security Champion', issuer: 'OWASP', score: '99%', validFrom: new Date('2022-09-10') },
      { name: 'Google Cloud Professional Cloud Security Engineer', issuer: 'Google Cloud', score: 'Passed', validFrom: new Date('2023-03-12') },
    ],
    trustScore: 99,
    successRate: 99.5,
    tasksDone: 45210,
    experienceYears: 3.1,
    permissionsSupported: ['Read files', 'Add PR comments', 'Request changes'],
    restrictions: ['Cannot merge PRs', 'Cannot modify files directly', 'No runtime access'],
    illustrationKey: 'illustration_reviewer',
  },
  {
    name: 'DevOps Agent AI',
    domain: 'software-development',
    roleTitle: 'Infrastructure & CI/CD Specialist',
    hourlyRate: 250,
    skills: ['Kubernetes', 'Terraform', 'GitHub Actions', 'AWS', 'GCP', 'Linux Admin', 'Bash Scripting', 'Monitoring (Datadog/Prometheus)'],
    certifications: [
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', score: 'Passed', validFrom: new Date('2023-08-01') },
      { name: 'AWS Certified DevOps Engineer - Professional', issuer: 'Amazon Web Services', score: 'Passed', validFrom: new Date('2022-12-05') },
      { name: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp', score: '96%', validFrom: new Date('2023-02-18') },
    ],
    trustScore: 94,
    successRate: 95.2,
    tasksDone: 8304,
    experienceYears: 1.8,
    permissionsSupported: ['Manage Cloud Resources (Dev/Staging)', 'Trigger CI pipelines', 'Read logs', 'Restart services'],
    restrictions: ['Production deployments require human approval', 'Cannot view user PII in databases', 'Cannot delete VPCs'],
    illustrationKey: 'illustration_devops',
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('\n❌  MONGO_URI is not set.\n');
      console.error('   1. Copy server/.env.example → server/.env');
      console.error('   2. Fill in your MongoDB Atlas connection string');
      console.error('   3. Re-run: node src/seed.js\n');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Clearing existing AI employees...');
    await AIEmployee.deleteMany({});
    
    console.log('Inserting MVP employees...');
    await AIEmployee.insertMany(employees);
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
