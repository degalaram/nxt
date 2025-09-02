import {
  type User, type InsertUser, type Company, type InsertCompany,
  type Job, type InsertJob, type Course, type InsertCourse,
  type Application, type InsertApplication, type Contact, type InsertContact,
  type LoginData
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  validateUser(email: string, password: string): Promise<User | undefined>;
  updateUserPassword(email: string, newPassword: string): Promise<void>;

  // Password reset
  storePasswordResetOtp(email: string, otp: string): Promise<void>;
  verifyPasswordResetOtp(email: string, otp: string): Promise<boolean>;
  clearPasswordResetOtp(email: string): Promise<void>;

  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Jobs
  getJobs(filters?: { experienceLevel?: string; location?: string; search?: string }): Promise<(Job & { company: Company })[]>;
  getJob(id: string): Promise<(Job & { company: Company }) | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;

  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  deleteApplication(id: string): Promise<void>;

  // Courses
  getCourses(category?: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Contact
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private companies: Map<string, Company>;
  private jobs: Map<string, Job>;
  private courses: Map<string, Course>;
  private applications: Map<string, Application>;
  private contacts: Map<string, Contact>;
  private passwordResetOtps: Map<string, { otp: string; expiresAt: Date }>;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.jobs = new Map();
    this.courses = new Map();
    this.applications = new Map();
    this.contacts = new Map();
    this.passwordResetOtps = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  async initializeSampleData() {
    // Add new companies to ensure they persist
    const newCompanies = [
      {
        id: "adp-id",
        name: "ADP",
        description: "Automatic Data Processing - A provider of cloud-based human capital management solutions",
        website: "https://adp.com",
        linkedinUrl: "https://linkedin.com/company/adp",
        logo: "https://logos-world.net/wp-content/uploads/2021/02/ADP-Logo.png",
        location: "Bengaluru, India",
        createdAt: new Date(),
      },
      {
        id: "honeywell-id",
        name: "Honeywell",
        description: "A Fortune 100 technology company that delivers industry-specific solutions",
        website: "https://honeywell.com",
        linkedinUrl: "https://linkedin.com/company/honeywell",
        logo: "https://logos-world.net/wp-content/uploads/2020/09/Honeywell-Logo.png",
        location: "Bengaluru, India",
        createdAt: new Date(),
      }
    ];

    // Sample companies (including existing ones)
    const companies = [
      {
        id: "accenture-id",
        name: "Accenture",
        description: "A leading global professional services company",
        website: "https://accenture.com",
        linkedinUrl: "https://linkedin.com/company/accenture",
        logo: "https://logoeps.com/wp-content/uploads/2014/05/36208-accenture-vector-logo.png",
        location: "Bengaluru, India",
        createdAt: new Date(),
      },
      {
        id: "tcs-id",
        name: "Tata Consultancy Services",
        description: "An Indian multinational IT services and consulting company",
        website: "https://tcs.com",
        linkedinUrl: "https://linkedin.com/company/tcs",
        logo: "/images/tcs-logo.png",
        location: "Mumbai, India",
        createdAt: new Date(),
      },
      {
        id: "infosys-id",
        name: "Infosys",
        description: "A global leader in next-generation digital services and consulting",
        website: "https://infosys.com",
        linkedinUrl: "https://linkedin.com/company/infosys",
        logo: "/images/infosys-logo.png",
        location: "Bengaluru, India",
        createdAt: new Date(),
      },
      {
        id: "hcl-id",
        name: "HCL Technologies",
        description: "An Indian multinational IT services and consulting company",
        website: "https://hcltech.com",
        linkedinUrl: "https://linkedin.com/company/hcl-technologies",
        logo: "https://logoeps.com/wp-content/uploads/2013/03/hcl-vector-logo.png",
        location: "Noida, India",
        createdAt: new Date(),
      },
      {
        id: "wipro-id",
        name: "Wipro",
        description: "A leading global information technology, consulting and business process services company",
        website: "https://wipro.com",
        linkedinUrl: "https://linkedin.com/company/wipro",
        logo: "https://logoeps.com/wp-content/uploads/2013/03/wipro-vector-logo.png",
        location: "Bengaluru, India",
        createdAt: new Date(),
      },
      {
        id: "cognizant-id",
        name: "Cognizant",
        description: "An American multinational information technology services and consulting company",
        website: "https://cognizant.com",
        linkedinUrl: "https://linkedin.com/company/cognizant",
        logo: "https://logoeps.com/wp-content/uploads/2013/03/cognizant-vector-logo.png",
        location: "Chennai, India",
        createdAt: new Date(),
      },
      ...newCompanies
    ];

    companies.forEach(company => this.companies.set(company.id, company));

    // Sample jobs
    const jobs = [
      {
        id: "job-1",
        companyId: "accenture-id",
        title: "Software Developer - Fresher",
        description: "Join our dynamic team as a Software Developer. Work on cutting-edge projects and grow your career in technology.",
        requirements: "Basic programming knowledge, problem-solving skills, willingness to learn",
        qualifications: "Bachelor's degree in Computer Science, IT, or related field",
        skills: "Java, Python, JavaScript, SQL, Git, Problem-solving",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 1,
        location: "Bengaluru, Chennai, Hyderabad",
        jobType: "full-time",
        salary: "₹3.5 - 4.5 LPA",
        applyUrl: "https://accenture.com/careers",
        closingDate: new Date('2025-09-17'),
        batchEligible: "2024",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-2",
        companyId: "tcs-id",
        title: "Associate Software Engineer",
        description: "Join TCS as an Associate Software Engineer and work on innovative solutions for global clients.",
        requirements: "Programming fundamentals, analytical thinking, good communication skills",
        qualifications: "B.E/B.Tech/M.E/M.Tech/MCA/MSc in relevant field",
        skills: "C, C++, Java, Database concepts, Web technologies, Logical reasoning",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 0,
        location: "Pune, Kolkata, Kochi",
        jobType: "full-time",
        salary: "₹3.36 LPA",
        applyUrl: "https://tcs.com/careers",
        closingDate: new Date('2025-09-22'),
        batchEligible: "2024",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-3",
        companyId: "infosys-id",
        title: "Systems Engineer - Fresher",
        description: "Start your career with Infosys as a Systems Engineer. Work with latest technologies and contribute to digital transformation.",
        requirements: "Strong technical foundation, problem-solving skills, adaptability",
        qualifications: "Engineering graduate from any discipline",
        skills: "Programming concepts, Database fundamentals, Communication skills",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 1,
        location: "Bengaluru, Mysore, Pune",
        jobType: "full-time",
        salary: "₹3.6 - 4.2 LPA",
        applyUrl: "https://infosys.com/careers",
        closingDate: new Date('2025-10-15'),
        batchEligible: "2024",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-4",
        companyId: "hcl-id",
        title: "Graduate Engineer Trainee",
        description: "Join HCL Technologies as a Graduate Engineer Trainee and build enterprise solutions for Fortune 500 companies.",
        requirements: "Technical aptitude, learning mindset, team collaboration",
        qualifications: "B.Tech/B.E/MCA/M.Tech in Computer Science or related",
        skills: "Java, Python, SQL, Web development, Problem solving",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 1,
        location: "Chennai, Noida, Bengaluru",
        jobType: "full-time",
        salary: "₹3.2 - 4.8 LPA",
        applyUrl: "https://hcltech.com/careers",
        closingDate: new Date('2025-08-30'),
        batchEligible: "2024",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-5",
        companyId: "accenture-id",
        title: "Senior Software Engineer",
        description: "Lead development teams and drive technical excellence in enterprise-level applications.",
        requirements: "Proven experience in software development, leadership skills, microservices architecture",
        qualifications: "Bachelor's/Master's degree with 3+ years of experience.",
        skills: "Java, Spring Boot, Microservices, Cloud, Team Leadership",
        experienceLevel: "experienced",
        experienceMin: 3,
        experienceMax: 6,
        location: "Bengaluru, Gurgaon",
        jobType: "full-time",
        salary: "₹12 - 18 LPA",
        applyUrl: "https://accenture.com/careers/apply",
        closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-6",
        companyId: "tcs-id",
        title: "Technical Lead - Full Stack",
        description: "Lead full-stack development projects and mentor junior developers.",
        requirements: "Full-stack development expertise, team management, client interaction",
        qualifications: "Engineering degree with 4+ years of experience.",
        skills: "React, Node.js, Python, AWS, Team Management",
        experienceLevel: "experienced",
        experienceMin: 4,
        experienceMax: 8,
        location: "Chennai, Mumbai",
        jobType: "full-time",
        salary: "₹15 - 22 LPA",
        applyUrl: "https://tcs.com/careers",
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-7",
        companyId: "infosys-id",
        title: "Data Scientist - Experienced",
        description: "Contribute to data-driven decision making and build predictive models.",
        requirements: "Strong analytical skills, experience with ML algorithms, Python/R proficiency",
        qualifications: "Master's/Ph.D. in Data Science, Statistics, or related field with 3+ years of experience.",
        skills: "Machine Learning, Python, R, SQL, Data Visualization, Statistical Modeling",
        experienceLevel: "experienced",
        experienceMin: 3,
        experienceMax: 7,
        location: "Bengaluru, Hyderabad",
        jobType: "full-time",
        salary: "₹14 - 20 LPA",
        applyUrl: "https://infosys.com/careers/data-science",
        closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-8",
        companyId: "wipro-id",
        title: "Cloud Engineer",
        description: "Design, implement, and manage cloud infrastructure and services.",
        requirements: "Experience with cloud platforms (AWS, Azure, GCP), infrastructure as code",
        qualifications: "Bachelor's degree in Computer Science or related field with 2+ years of experience.",
        skills: "AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD",
        experienceLevel: "experienced",
        experienceMin: 2,
        experienceMax: 5,
        location: "Bengaluru, Pune",
        jobType: "full-time",
        salary: "₹10 - 16 LPA",
        applyUrl: "https://wipro.com/careers/cloud-engineer",
        closingDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-9",
        companyId: "cognizant-id",
        title: "Java Developer",
        description: "Develop robust and scalable Java applications for enterprise clients.",
        requirements: "Strong Java programming skills, experience with Spring framework",
        qualifications: "Bachelor's degree in Computer Science or related field with 2+ years of experience.",
        skills: "Java, Spring Boot, Hibernate, RESTful APIs, SQL, Git",
        experienceLevel: "experienced",
        experienceMin: 2,
        experienceMax: 5,
        location: "Chennai, Coimbatore",
        jobType: "full-time",
        salary: "₹9 - 15 LPA",
        applyUrl: "https://cognizant.com/careers/java-developer",
        closingDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-10",
        companyId: "hcl-id",
        title: "DevOps Engineer",
        description: "Implement and manage CI/CD pipelines, automate infrastructure, and ensure system reliability.",
        requirements: "Experience with DevOps tools and practices, scripting languages",
        qualifications: "Bachelor's degree in a relevant field with 3+ years of experience.",
        skills: "AWS, Docker, Kubernetes, Jenkins, Ansible, Python, Shell Scripting",
        experienceLevel: "experienced",
        experienceMin: 3,
        experienceMax: 6,
        location: "Noida, Bengaluru",
        jobType: "full-time",
        salary: "₹11 - 17 LPA",
        applyUrl: "https://hcltech.com/careers/devops-engineer",
        closingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        batchEligible: "",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "job-expired",
        companyId: "infosys-id",
        title: "Software Developer - Expired",
        description: "This position has been closed.",
        requirements: "Programming skills",
        qualifications: "Bachelor's degree",
        skills: "Java, Python",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 1,
        location: "Bengaluru",
        jobType: "full-time",
        salary: "₹3.5 LPA",
        applyUrl: "https://infosys.com/careers",
        closingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        batchEligible: "2024",
        isActive: false,
        createdAt: new Date(),
      }
    ];

    jobs.forEach(job => this.jobs.set(job.id, job));

    // Sample courses
    const courses = [
      {
        id: "html-course",
        title: "Complete HTML & CSS Course",
        description: "Learn HTML and CSS from scratch. Build responsive websites and understand web fundamentals.",
        instructor: "John Doe",
        duration: "6 weeks",
        level: "beginner",
        category: "web-development",
        imageUrl: "/images/html_css_course.png",
        courseUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "python-course",
        title: "Python Programming for Beginners",
        description: "Master Python programming from basics to advanced concepts. Perfect for beginners and job seekers.",
        instructor: "Jane Smith",
        duration: "8 weeks",
        level: "beginner",
        category: "programming",
        imageUrl: "/images/python_course.png",
        courseUrl: "https://www.python.org/about/gettingstarted/",
        price: "₹2,999",
        createdAt: new Date(),
      },
      {
        id: "javascript-course",
        title: "JavaScript Fundamentals",
        description: "Learn JavaScript programming language and build interactive web applications.",
        instructor: "Mike Johnson",
        duration: "10 weeks",
        level: "intermediate",
        category: "web-development",
        imageUrl: "/images/javascript_course.png",
        courseUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        price: "₹3,999",
        createdAt: new Date(),
      },
      {
        id: "react-course",
        title: "React.js Development",
        description: "Build modern web applications with React.js. Learn components, hooks, and state management.",
        instructor: "Sarah Wilson",
        duration: "12 weeks",
        level: "intermediate",
        category: "web-development",
        imageUrl: "/images/react_course.png",
        courseUrl: "https://react.dev/learn",
        price: "₹4,999",
        createdAt: new Date(),
      },
      {
        id: "nodejs-course",
        title: "Node.js Backend Development",
        description: "Master server-side development with Node.js. Build APIs and full-stack applications.",
        instructor: "David Lee",
        duration: "10 weeks",
        level: "intermediate",
        category: "backend",
        imageUrl: "/images/nodejs_course.png",
        courseUrl: "https://nodejs.org/en/docs/",
        price: "₹5,499",
        createdAt: new Date(),
      },
      {
        id: "data-structures-course",
        title: "Data Structures & Algorithms",
        description: "Learn essential data structures and algorithms for programming interviews and competitive coding.",
        instructor: "Dr. Alex Kumar",
        duration: "14 weeks",
        level: "intermediate",
        category: "programming",
        imageUrl: "/images/dsa_course.png",
        courseUrl: "https://www.geeksforgeeks.org/data-structures/",
        price: "₹6,999",
        createdAt: new Date(),
      },
      {
        id: "machine-learning-course",
        title: "Introduction to Machine Learning",
        description: "Get started with machine learning concepts, algorithms, and practical implementation.",
        instructor: "Dr. Priya Sharma",
        duration: "16 weeks",
        level: "advanced",
        category: "data-science",
        imageUrl: "/images/ml_course.png",
        courseUrl: "https://www.tensorflow.org/learn/ml-basics",
        price: "₹8,999",
        createdAt: new Date(),
      },
      {
        id: "cybersecurity-course",
        title: "Cybersecurity Fundamentals",
        description: "Learn cybersecurity basics, ethical hacking, and network security principles.",
        instructor: "Mark Roberts",
        duration: "12 weeks",
        level: "intermediate",
        category: "cybersecurity",
        imageUrl: "/images/cybersecurity_course.png",
        courseUrl: "https://www.cybrary.it/courses/cybersecurity-fundamentals/",
        price: "₹7,499",
        createdAt: new Date(),
      },
      {
        id: "database-course",
        title: "Database Management Systems",
        description: "Master SQL, database design, and learn popular database management systems.",
        instructor: "Lisa Chen",
        duration: "8 weeks",
        level: "beginner",
        category: "database",
        imageUrl: "/images/database_course.png",
        courseUrl: "https://www.khanacademy.org/computing/computer-programming/sql",
        price: "₹3,499",
        createdAt: new Date(),
      },
      {
        id: "cloud-computing-course",
        title: "Cloud Computing Essentials",
        description: "Understand cloud concepts, services, and deployment models.",
        instructor: "Alice Green",
        duration: "10 weeks",
        level: "intermediate",
        category: "cloud",
        imageUrl: "/images/cloud_computing_course.png",
        courseUrl: "https://aws.amazon.com/training/cloud-essentials/",
        price: "₹6,000",
        createdAt: new Date(),
      },
      {
        id: "devops-course",
        title: "DevOps Principles and Practices",
        description: "Learn DevOps methodologies, tools, and practices for continuous integration and delivery.",
        instructor: "Bob White",
        duration: "12 weeks",
        level: "intermediate",
        category: "devops",
        imageUrl: "/images/devops_course.png",
        courseUrl: "https://azure.microsoft.com/en-us/services/devops/",
        price: "₹7,500",
        createdAt: new Date(),
      }
    ];

    courses.forEach(course => this.courses.set(course.id, course));

    // Sample projects
    const projects = [
      {
        id: "project-1",
        title: "Job Portal Web Application",
        description: "A full-stack web application for job seekers and employers.",
        technologies: ["React", "Node.js", "Express", "MongoDB"],
        demoUrl: "https://job-portal-demo.example.com",
        codeUrl: "https://github.com/yourusername/job-portal",
        createdAt: new Date(),
      },
      {
        id: "project-2",
        title: "E-commerce Platform",
        description: "An online store with product catalog, shopping cart, and payment gateway integration.",
        technologies: ["React", "Django", "PostgreSQL"],
        demoUrl: "https://ecommerce-demo.example.com",
        codeUrl: "https://github.com/yourusername/ecommerce",
        createdAt: new Date(),
      },
      {
        id: "project-3",
        title: "Task Management Tool",
        description: "A productivity tool to manage tasks, projects, and deadlines.",
        technologies: ["Vue.js", "Firebase"],
        demoUrl: "https://task-manager-demo.example.com",
        codeUrl: "https://github.com/yourusername/task-manager",
        createdAt: new Date(),
      },
      {
        id: "project-4",
        title: "Blog Application",
        description: "A simple blogging platform with user authentication and content management.",
        technologies: ["Angular", "Node.js", "MySQL"],
        demoUrl: "https://blog-demo.example.com",
        codeUrl: "https://github.com/yourusername/blog-app",
        createdAt: new Date(),
      },
      {
        id: "project-5",
        title: "Data Visualization Dashboard",
        description: "A dashboard to visualize data trends and insights.",
        technologies: ["Python", "Pandas", "Matplotlib", "Flask"],
        demoUrl: "https://dataviz-demo.example.com",
        codeUrl: "https://github.com/yourusername/data-visualization",
        createdAt: new Date(),
      }
    ];

    // Add projects to storage (assuming a 'projects' map exists or is added)
    // For now, let's just log them to simulate having them
    // console.log("Initialized projects:", projects);
  }

  // Auth methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = randomUUID();
    const user: User = {
      id,
      email: insertUser.email,
      fullName: insertUser.fullName,
      phone: insertUser.phone || null,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = {
      id,
      name: insertCompany.name,
      description: insertCompany.description || null,
      website: insertCompany.website || null,
      linkedinUrl: insertCompany.linkedinUrl || null,
      logo: insertCompany.logo || null,
      location: insertCompany.location || null,
      createdAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  // Job methods
  async getJobs(filters?: { experienceLevel?: string; location?: string; search?: string }): Promise<(Job & { company: Company })[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters?.experienceLevel) {
      jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters?.location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.skills.toLowerCase().includes(search)
      );
    }

    return jobs.map(job => {
      const company = this.companies.get(job.companyId)!;
      return { ...job, company };
    });
  }

  async getJob(id: string): Promise<(Job & { company: Company }) | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const company = this.companies.get(job.companyId)!;
    return { ...job, company };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      id,
      companyId: insertJob.companyId,
      title: insertJob.title,
      description: insertJob.description,
      requirements: insertJob.requirements,
      qualifications: insertJob.qualifications,
      skills: insertJob.skills,
      experienceLevel: insertJob.experienceLevel,
      experienceMin: insertJob.experienceMin || null,
      experienceMax: insertJob.experienceMax || null,
      location: insertJob.location,
      jobType: insertJob.jobType,
      salary: insertJob.salary || null,
      applyUrl: insertJob.applyUrl || null,
      closingDate: insertJob.closingDate,
      batchEligible: insertJob.batchEligible || null,
      isActive: insertJob.isActive ?? true,
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const existing = this.jobs.get(id);
    if (!existing) return undefined;

    const updated: Job = { ...existing, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  // Application methods
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      id,
      userId: insertApplication.userId,
      jobId: insertApplication.jobId,
      status: insertApplication.status || null,
      appliedAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    const userApps = Array.from(this.applications.values()).filter(app => app.userId === userId);

    return userApps.map(app => {
      const job = this.jobs.get(app.jobId)!;
      const company = this.companies.get(job.companyId)!;
      return { ...app, job: { ...job, company } };
    });
  }

  async deleteApplication(id: string): Promise<void> {
    this.applications.delete(id);
  }

  // Course methods
  async getCourses(category?: string): Promise<Course[]> {
    let courses = Array.from(this.courses.values());

    if (category) {
      courses = courses.filter(course => course.category === category);
    }

    return courses;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      id,
      title: insertCourse.title,
      description: insertCourse.description,
      instructor: insertCourse.instructor || null,
      duration: insertCourse.duration || null,
      level: insertCourse.level || null,
      category: insertCourse.category,
      imageUrl: insertCourse.imageUrl || null,
      courseUrl: insertCourse.courseUrl || null,
      price: insertCourse.price || null,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  // Company deletion method
  async deleteCompany(id: string): Promise<boolean> {
    // First, delete all jobs associated with this company
    const jobsToDelete = Array.from(this.jobs.values()).filter(job => job.companyId === id);
    jobsToDelete.forEach(job => this.jobs.delete(job.id));
    
    // Then delete the company
    const deleted = this.companies.delete(id);
    return deleted;
  }

  // Password reset methods
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = { ...user, password: hashedPassword };
    this.users.set(user.id, updatedUser);
  }

  async storePasswordResetOtp(email: string, otp: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    this.passwordResetOtps.set(email, { otp, expiresAt });
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<boolean> {
    const stored = this.passwordResetOtps.get(email);
    if (!stored) {
      return false;
    }

    // Check if OTP has expired
    if (new Date() > stored.expiresAt) {
      this.passwordResetOtps.delete(email);
      return false;
    }

    return stored.otp === otp;
  }

  async clearPasswordResetOtp(email: string): Promise<void> {
    this.passwordResetOtps.delete(email);
  }
}

export const storage = new MemStorage();