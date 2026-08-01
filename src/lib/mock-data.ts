import { Code, Cloud, Layers, Cpu, Shield, Smartphone } from 'lucide-react';
import React from 'react';

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  gradient: string;
  accentColor: string;
  colorClass: string;
  tags: string[];
  tech: string[];
  functionality: string[];
  technologyStack: string[];
  coverImage: string;
  screenshots: { src: string; alt: string }[];
  featured: boolean;
  year: string;
}

export const projects: Project[] = [
  {
    slug: 'sensai',
    title: 'SENSAI',
    tagline: 'AI-Powered Career Guidance Platform',
    description:
      'A web platform that helps students explore career-specific industry insights, prepare for interviews, and create ATS-friendly resumes and cover letters with AI support.',
    category: 'Web Development',
    gradient: 'from-violet-600 to-indigo-600',
    accentColor: 'violet',
    colorClass: 'text-violet-500 bg-violet-500/10',
    tags: ['Web Development', 'UI/UX', 'React', 'AI/ML'],
    tech: ['Next.js', 'Clerk', 'Prisma', 'Neon DB', 'Inngest', 'Google Gemini API', 'Vercel'],
    functionality: [
      'View personalized industry insights for chosen career paths',
      'Build ATS-friendly resumes and cover letters',
      'Prepare for interviews with tailored AI guidance',
      'Practice quizzes with solutions and explanations',
      'User authentication with secure login/signup',
      'Dashboard for managing career resources & progress',
    ],
    technologyStack: [
      'Frontend: Next.js (React-based framework)',
      'Auth & User Mgmt: Clerk (authentication & authorization)',
      'Database: Prisma ORM + Neon (serverless Postgres)',
      'Background Tasks: Inngest (event-driven workflows)',
      'AI Integration: Google Gemini API',
      'Hosting & Infra: Vercel',
    ],
    coverImage: '/projects/sensai/cover.png',
    screenshots: [
      { src: '/projects/sensai/home.png', alt: 'SENSAI Home Dashboard' },
      { src: '/projects/sensai/industry.png', alt: 'Industry Insights' },
      { src: '/projects/sensai/resume.png', alt: 'Resume Builder' },
      { src: '/projects/sensai/mock.png', alt: 'Mock Interview Practice' },
      { src: '/projects/sensai/cover-letter.png', alt: 'Cover Letter Generator' },
    ],
    featured: true,
    year: '2024',
  },
  {
    slug: 'easy-farm-hub',
    title: 'Easy Farm Hub',
    tagline: 'Smart Farming Platform for Modern Agriculture',
    description:
      'A platform helping farmers with organic farming practices, government scheme discovery, and product management with multi-language support.',
    category: 'Web Development',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald',
    colorClass: 'text-emerald-500 bg-emerald-500/10',
    tags: ['Mobile App', 'Fintech', 'Multi-Language', 'Agriculture'],
    tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'PHP', 'MySQL'],
    functionality: [
      'User and admin login system with role-based access',
      'User registration with multi-language support (English/Gujarati)',
      'Admin can add and manage agricultural products',
      'Admin can publish organic farming technologies',
      'Admin can share new government schemes for farmers',
    ],
    technologyStack: [
      'Frontend: HTML, CSS, Bootstrap, JavaScript',
      'Backend: PHP (server-side logic)',
      'Database: MySQL',
      'Language Support: English ↔ Gujarati toggle',
      'Hosting & Infra: Localhost / Web server (XAMPP, Apache)',
    ],
    coverImage: '/projects/easy-farm-hub/cover.png',
    screenshots: [
      { src: '/projects/easy-farm-hub/home.jpeg', alt: 'Easy Farm Hub Home' },
      { src: '/projects/easy-farm-hub/about.jpeg', alt: 'About Section' },
      { src: '/projects/easy-farm-hub/organic.jpeg', alt: 'Organic Farming' },
      { src: '/projects/easy-farm-hub/product.jpeg', alt: 'Product Management' },
      { src: '/projects/easy-farm-hub/technology.jpeg', alt: 'Technology Section' },
    ],
    featured: true,
    year: '2024',
  },
  {
    slug: 'sankalp-library',
    title: 'Sankalp Library App',
    tagline: 'Discover, Reserve & Borrow Books Seamlessly',
    description:
      'A lightweight Flutter app to discover, reserve, and borrow books with offline support, making library management effortless for both users and administrators.',
    category: 'Mobile App',
    gradient: 'from-orange-500 to-amber-600',
    accentColor: 'orange',
    colorClass: 'text-orange-500 bg-orange-500/10',
    tags: ['Flutter', 'Firebase', 'Firestore', 'Mobile App'],
    tech: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Firebase Auth'],
    functionality: [
      'Browse and search a complete book catalog',
      'Reserve books online with instant confirmation',
      'Track borrow history and due dates',
      'Offline support for reading book details',
      'Admin panel for book management',
      'Push notifications for due date reminders',
    ],
    technologyStack: [
      'Frontend: Flutter (cross-platform mobile framework)',
      'Backend: Firebase (serverless backend)',
      'Database: Firestore (NoSQL real-time database)',
      'Authentication: Firebase Auth',
      'Offline Support: Hive / local caching',
      'Platform: iOS & Android',
    ],
    coverImage: '/projects/sankalp-library/cover.png',
    screenshots: [
      { src: '/projects/sankalp-library/home.png', alt: 'Library Home' },
      { src: '/projects/sankalp-library/catalog.png', alt: 'Book Catalog' },
      { src: '/projects/sankalp-library/reserve.png', alt: 'Book Reservation' },
      { src: '/projects/sankalp-library/history.png', alt: 'Borrow History' },
    ],
    featured: false,
    year: '2024',
  },
  {
    slug: 'ahmedabad-builders',
    title: 'Ahmedabad Builders',
    tagline: 'Your Trusted Construction Partner in Ahmedabad',
    description:
      'A professional website for a leading construction company, showcasing residential and commercial projects with an enterprise CRM system for client and project management.',
    category: 'Web Development',
    gradient: 'from-sky-500 to-blue-600',
    accentColor: 'sky',
    colorClass: 'text-sky-500 bg-sky-500/10',
    tags: ['CRM', 'Enterprise', 'Cloud', 'Construction'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Vercel'],
    functionality: [
      'Project showcase with high-resolution gallery',
      'Client inquiry and lead management CRM',
      'Project progress tracking dashboard',
      'Contact and quotation request forms',
      'Admin panel for content management',
      'SEO-optimized for local Ahmedabad searches',
    ],
    technologyStack: [
      'Frontend: React with Tailwind CSS',
      'Backend: Node.js + Express REST API',
      'Database: PostgreSQL (relational data)',
      'CMS: Custom admin panel',
      'Hosting: Vercel + Railway (database)',
      'SEO: Next.js static generation',
    ],
    coverImage: '/projects/ahmedabad-builders/cover.png',
    screenshots: [
      { src: '/projects/ahmedabad-builders/home.png', alt: 'Company Homepage' },
      { src: '/projects/ahmedabad-builders/projects.png', alt: 'Project Gallery' },
      { src: '/projects/ahmedabad-builders/contact.png', alt: 'Contact Page' },
    ],
    featured: false,
    year: '2024',
  },
  {
    slug: 'quickchat',
    title: 'QuickChat',
    tagline: 'Real-Time Messaging with Lightning Speed',
    description:
      'A real-time Flutter chat application for chatting & media sharing using Firebase, with secure, fast messaging and end-to-end encryption support.',
    category: 'Mobile App',
    gradient: 'from-pink-500 to-rose-600',
    accentColor: 'pink',
    colorClass: 'text-pink-500 bg-pink-500/10',
    tags: ['Flutter', 'Firebase', 'Real-time Chat', 'Mobile App'],
    tech: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Firebase Storage', 'FCM'],
    functionality: [
      'Real-time one-on-one and group messaging',
      'Image, video, and file sharing',
      'Push notifications via Firebase Cloud Messaging',
      'User status indicators (online/offline/typing)',
      'Message read receipts',
      'Secure authentication with Firebase Auth',
    ],
    technologyStack: [
      'Frontend: Flutter (cross-platform)',
      'Real-time Database: Firebase Firestore',
      'File Storage: Firebase Storage',
      'Notifications: Firebase Cloud Messaging (FCM)',
      'Authentication: Firebase Auth',
      'Platform: iOS & Android',
    ],
    coverImage: '/projects/quickchat/cover.png',
    screenshots: [
      { src: '/projects/quickchat/chat.png', alt: 'Chat Interface' },
      { src: '/projects/quickchat/groups.png', alt: 'Group Chats' },
      { src: '/projects/quickchat/profile.png', alt: 'User Profile' },
      { src: '/projects/quickchat/media.png', alt: 'Media Sharing' },
    ],
    featured: true,
    year: '2024',
  },
  {
    slug: 'smart-irrigation',
    title: 'Smart Irrigation System',
    tagline: 'IoT-Powered Precision Agriculture',
    description:
      'A smart irrigation system that automates watering and suggests suitable crops using real-time soil moisture and weather data — reducing water waste and maximizing yield.',
    category: 'IoT & AI',
    gradient: 'from-teal-500 to-cyan-600',
    accentColor: 'teal',
    colorClass: 'text-teal-500 bg-teal-500/10',
    tags: ['Crop-prediction', 'Farming', 'IoT', 'AI/ML'],
    tech: ['Python', 'Raspberry Pi', 'MQTT', 'TensorFlow Lite', 'React', 'Firebase'],
    functionality: [
      'Real-time soil moisture and temperature monitoring',
      'Automated irrigation scheduling based on sensor data',
      'AI-based crop recommendation system',
      'Weather API integration for smart decisions',
      'Mobile dashboard for remote monitoring and control',
      'Alert system for abnormal conditions',
    ],
    technologyStack: [
      'Hardware: Raspberry Pi + Soil/Weather Sensors',
      'Communication: MQTT Protocol',
      'AI Model: TensorFlow Lite (crop prediction)',
      'Backend: Python FastAPI',
      'Frontend: React dashboard',
      'Cloud: Firebase Realtime Database',
    ],
    coverImage: '/projects/smart-irrigation/cover.png',
    screenshots: [
      { src: '/projects/smart-irrigation/dashboard.png', alt: 'IoT Dashboard' },
      { src: '/projects/smart-irrigation/sensors.png', alt: 'Sensor Data' },
      { src: '/projects/smart-irrigation/crop-suggest.png', alt: 'Crop Suggestions' },
    ],
    featured: false,
    year: '2024',
  },
  {
    slug: 'adventure-sports-club',
    title: 'Adventure Sports Club',
    tagline: 'World-Class Sports & Fitness for All Ages',
    description:
      'A modern website for an adventure sports club offering world-class indoor and outdoor facilities including swimming, gym, and various sports, designed for all age groups.',
    category: 'Web Development',
    gradient: 'from-amber-500 to-orange-600',
    accentColor: 'amber',
    colorClass: 'text-amber-500 bg-amber-500/10',
    tags: ['Sports', 'Swim + Gym', 'Fitness', 'Website'],
    tech: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Stripe'],
    functionality: [
      'Membership plans and online enrollment',
      'Class scheduling and online booking system',
      'Trainer profiles and specialization showcase',
      'Facilities tour with image gallery',
      'Online payment integration via Stripe',
      'Member portal for tracking fitness progress',
    ],
    technologyStack: [
      'Frontend: React + Tailwind CSS',
      'Backend: Node.js + Express',
      'Database: MongoDB (flexible member data)',
      'Payments: Stripe integration',
      'Authentication: JWT-based auth',
      'Hosting: Vercel + Railway',
    ],
    coverImage: '/projects/adventure-sports-club/cover.png',
    screenshots: [
      { src: '/projects/adventure-sports-club/home.png', alt: 'Club Homepage' },
      { src: '/projects/adventure-sports-club/facilities.png', alt: 'Facilities' },
      { src: '/projects/adventure-sports-club/classes.png', alt: 'Classes' },
      { src: '/projects/adventure-sports-club/membership.png', alt: 'Membership Plans' },
    ],
    featured: false,
    year: '2024',
  },
  {
    slug: 'crunchy-coffee',
    title: 'Crunchy — A Coffee App',
    tagline: 'Order Your Perfect Coffee, Anytime',
    description:
      'The Coffee App lets users browse, order, and enjoy fast delivery with a personalized experience — featuring favorites, order history, and loyalty rewards.',
    category: 'Mobile App',
    gradient: 'from-yellow-600 to-amber-700',
    accentColor: 'yellow',
    colorClass: 'text-yellow-500 bg-yellow-500/10',
    tags: ['Flutter', 'Firebase', 'Coffee Delivery', 'Mobile App'],
    tech: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Razorpay', 'Google Maps API'],
    functionality: [
      'Browse curated menu with categories and filters',
      'Add to cart and place orders with real-time tracking',
      'Favorites list for quick re-ordering',
      'Loyalty rewards and coupon system',
      'Order history and receipt generation',
      'Live delivery tracking with Google Maps',
    ],
    technologyStack: [
      'Frontend: Flutter (cross-platform mobile)',
      'Backend: Firebase (serverless)',
      'Database: Firestore (real-time orders)',
      'Payments: Razorpay integration',
      'Maps: Google Maps API (delivery tracking)',
      'Platform: iOS & Android',
    ],
    coverImage: '/projects/crunchy-coffee/cover.png',
    screenshots: [
      { src: '/projects/crunchy-coffee/home.jpeg', alt: 'Coffee Menu' },
      { src: '/projects/crunchy-coffee/order.jpeg', alt: 'Order Screen' },
      { src: '/projects/crunchy-coffee/tracking.jpeg', alt: 'Live Tracking' },
      { src: '/projects/crunchy-coffee/profile.jpeg', alt: 'User Profile' },
    ],
    featured: false,
    year: '2024',
  },
];

export interface Service {
  slug: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  longDesc: string;
  features: string[];
  tech: string[];
  gradient: string;
  colorClass: string;
  accentColor: string;
}

export const services: Service[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    icon: React.createElement(Code, { className: 'h-6 w-6' }),
    shortDesc:
      'Custom web applications built with React, Next.js, and TypeScript — fast, SEO-optimized, and pixel-perfect.',
    longDesc:
      'We craft modern, high-performance web applications from the ground up. Using Next.js App Router, server components, and edge rendering, we build platforms that load instantly, rank well on search engines, and scale effortlessly under traffic surges. From landing pages to complex SaaS dashboards, every pixel is deliberate.',
    features: [
      'Next.js 15+ App Router & Server Components',
      'Responsive & accessible UI/UX design',
      'SEO optimization & Core Web Vitals excellence',
      'Authentication, authorization & role-based access',
      'Third-party API & payment gateway integrations',
      'Performance auditing & continuous optimization',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    gradient: 'from-indigo-600 to-purple-600',
    colorClass: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10',
    accentColor: 'indigo',
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile App Development',
    icon: React.createElement(Smartphone, { className: 'h-6 w-6' }),
    shortDesc:
      'Native and cross-platform mobile apps for iOS & Android, built with Flutter and React Native.',
    longDesc:
      'We develop beautiful, high-performance mobile applications for both iOS and Android platforms. Whether you need a cross-platform solution with Flutter or a React Native app that feels truly native, our team delivers smooth 60fps animations, offline capabilities, and seamless app store deployments.',
    features: [
      'Cross-platform iOS & Android from a single codebase',
      'Native-feel UI with fluid 60fps animations',
      'Offline-first architecture with local persistence',
      'Push notifications & background services',
      'App Store & Google Play submission support',
      'Analytics integration & crash reporting',
    ],
    tech: ['Flutter', 'React Native', 'Dart', 'Firebase', 'TypeScript', 'REST APIs'],
    gradient: 'from-purple-600 to-violet-600',
    colorClass: 'text-purple-500 dark:text-purple-400 bg-purple-500/10',
    accentColor: 'purple',
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps Solutions',
    icon: React.createElement(Cloud, { className: 'h-6 w-6' }),
    shortDesc:
      'Scalable cloud infrastructure, CI/CD pipelines, and container orchestration for enterprise reliability.',
    longDesc:
      'We architect and manage cloud environments on AWS, GCP, and Azure that are secure, cost-optimized, and built for scale. Our DevOps practice automates your entire delivery pipeline — from code commit to production deployment — reducing release cycles from weeks to hours while maintaining enterprise-grade reliability.',
    features: [
      'Cloud architecture design & migration (AWS / GCP / Azure)',
      'Automated CI/CD pipelines with GitHub Actions',
      'Kubernetes & Docker container orchestration',
      'Infrastructure as Code with Terraform',
      'Real-time monitoring, alerting & observability',
      'Cost optimization & cloud FinOps strategies',
    ],
    tech: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    gradient: 'from-sky-600 to-cyan-600',
    colorClass: 'text-sky-500 dark:text-sky-400 bg-sky-500/10',
    accentColor: 'sky',
  },
  {
    slug: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: React.createElement(Cpu, { className: 'h-6 w-6' }),
    shortDesc:
      'Intelligent AI-powered features, predictive analytics, and custom ML models integrated into your product.',
    longDesc:
      'We integrate cutting-edge AI and machine learning capabilities directly into your products. From building custom large language model pipelines and fine-tuned models to deploying recommendation engines and computer vision systems, we bring intelligence to your business in a practical, production-ready way.',
    features: [
      'LLM integration & RAG pipeline development',
      'Custom model training & fine-tuning',
      'Predictive analytics & forecasting systems',
      'Computer vision & image recognition',
      'NLP for text classification & sentiment analysis',
      'AI model monitoring & MLOps pipelines',
    ],
    tech: ['Python', 'PyTorch', 'LangChain', 'OpenAI API', 'Hugging Face', 'FastAPI'],
    gradient: 'from-violet-600 to-fuchsia-600',
    colorClass: 'text-violet-500 dark:text-violet-400 bg-violet-500/10',
    accentColor: 'violet',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    icon: React.createElement(Shield, { className: 'h-6 w-6' }),
    shortDesc:
      'End-to-end security audits, penetration testing, and compliance consulting to safeguard your digital assets.',
    longDesc:
      'Security cannot be an afterthought. Our cybersecurity team conducts thorough vulnerability assessments, penetration tests, and architecture reviews to identify and eliminate risks before attackers exploit them. We also guide your team through compliance frameworks like SOC 2, ISO 27001, and GDPR.',
    features: [
      'Penetration testing & vulnerability assessments',
      'Web application security audits (OWASP)',
      'Cloud security posture management (CSPM)',
      'SOC 2, ISO 27001 & GDPR compliance guidance',
      'Secure SDLC training & developer education',
      'Incident response planning & threat modeling',
    ],
    tech: ['Burp Suite', 'OWASP ZAP', 'Nessus', 'AWS Security Hub', 'Snyk', 'Vault'],
    gradient: 'from-pink-600 to-rose-600',
    colorClass: 'text-pink-500 dark:text-pink-400 bg-pink-500/10',
    accentColor: 'pink',
  },
  {
    slug: 'erp-enterprise',
    title: 'ERP & Enterprise Software',
    icon: React.createElement(Layers, { className: 'h-6 w-6' }),
    shortDesc:
      'Tailored ERP systems, CRM integrations, and business automation tools built for operational excellence.',
    longDesc:
      'Off-the-shelf ERP systems rarely fit the nuanced workflows of growing enterprises. We design and build custom ERP platforms, CRM integrations, and business process automation solutions that mirror exactly how your organization operates — eliminating manual work, unifying data, and empowering decision-makers with real-time insights.',
    features: [
      'Custom ERP module design & development',
      'CRM integrations (Salesforce, HubSpot, Zoho)',
      'Business process automation & workflow engines',
      'Multi-tenant SaaS architecture',
      'Advanced reporting & business intelligence dashboards',
      'Legacy system migration & modernization',
    ],
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'REST / GraphQL'],
    gradient: 'from-amber-600 to-orange-600',
    colorClass: 'text-amber-500 dark:text-amber-400 bg-amber-500/10',
    accentColor: 'amber',
  },
];

import { IconType } from 'react-icons';
import { FaAws, FaApple } from 'react-icons/fa';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiVite,
  SiRedux,
  SiShadcnui,
  SiNodedotjs,
  SiFastapi,
  SiExpress,
  SiGraphql,
  SiTrpc,
  SiPrisma,
  SiPython,
  SiGo,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiSupabase,
  SiFirebase,
  SiPlanetscale,
  SiNeon,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiVercel,
  SiNginx,
  SiFlutter,
  SiDart,
  SiExpo,
  SiSwift,
  SiJetpackcompose,
} from 'react-icons/si';

export type TechGroup = {
  category: string;
  colorClass: string;
  gradient: string;
  items: { name: string; icon: IconType }[];
};

export const technologies: TechGroup[] = [
  {
    category: 'Frontend',
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    gradient: 'from-indigo-500 to-purple-500',
    items: [
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'React', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Framer Motion', icon: SiFramer },
      { name: 'Vite', icon: SiVite },
      { name: 'Redux Toolkit', icon: SiRedux },
      { name: 'shadcn/ui', icon: SiShadcnui },
    ],
  },
  {
    category: 'Backend',
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-500',
    items: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Express.js', icon: SiExpress },
      { name: 'GraphQL', icon: SiGraphql },
      { name: 'tRPC', icon: SiTrpc },
      { name: 'Prisma', icon: SiPrisma },
      { name: 'Python', icon: SiPython },
      { name: 'Go', icon: SiGo },
    ],
  },
  {
    category: 'Database',
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    gradient: 'from-amber-500 to-orange-500',
    items: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Redis', icon: SiRedis },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Supabase', icon: SiSupabase },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'PlanetScale', icon: SiPlanetscale },
      { name: 'Neon DB', icon: SiNeon },
    ],
  },
  {
    category: 'DevOps & Cloud',
    colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    gradient: 'from-sky-500 to-cyan-500',
    items: [
      { name: 'AWS', icon: FaAws },
      { name: 'GCP', icon: SiGooglecloud },
      { name: 'Docker', icon: SiDocker },
      { name: 'Kubernetes', icon: SiKubernetes },
      { name: 'Terraform', icon: SiTerraform },
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Nginx', icon: SiNginx },
    ],
  },
  {
    category: 'Mobile',
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    gradient: 'from-purple-500 to-violet-500',
    items: [
      { name: 'Flutter', icon: SiFlutter },
      { name: 'React Native', icon: SiReact },
      { name: 'Dart', icon: SiDart },
      { name: 'Expo', icon: SiExpo },
      { name: 'SwiftUI', icon: SiSwift },
      { name: 'Jetpack Compose', icon: SiJetpackcompose },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'App Center', icon: FaApple },
    ],
  },
];

import { BlogPost, JobPosition } from '../types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'future-of-ai-in-healthcare',
    title: 'The Future of AI in Healthcare: Transforming Patient Outcomes',
    excerpt:
      'Discover how artificial intelligence is revolutionizing the healthcare industry, from early diagnosis to personalized treatment plans.',
    content: `
      <h2>The Dawn of a New Era in Medicine</h2>
      <p>Artificial Intelligence (AI) is no longer just a buzzword; it's a driving force in the healthcare sector. By analyzing vast amounts of medical data, AI algorithms can identify patterns that human doctors might miss, leading to earlier and more accurate diagnoses.</p>
      <br/>
      <h3>Personalized Treatment Plans</h3>
      <p>One of the most exciting applications of AI is in the realm of personalized medicine. By analyzing a patient's genetic makeup, lifestyle, and medical history, AI can help doctors tailor treatment plans that are specific to the individual, increasing the chances of a successful outcome while minimizing side effects.</p>
      <br/>
      <h3>The Role of Predictive Analytics</h3>
      <p>Predictive analytics powered by AI can forecast outbreaks of diseases and help hospitals manage their resources more effectively. By predicting patient admission rates, healthcare facilities can ensure they have adequate staff and supplies on hand.</p>
      <br/>
      <p>As we continue to develop more sophisticated AI tools, the possibilities for improving patient care are virtually limitless.</p>
    `,
    author: {
      name: 'Dr. Jane Smith',
      avatar: 'https://i.pravatar.cc/150?u=jane_smith',
    },
    publishDate: '2026-07-15',
    category: 'Healthcare',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=400',
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'sustainable-tech-innovations',
    title: 'Sustainable Tech: Innovations Driving a Greener Tomorrow',
    excerpt:
      'Explore the latest technological advancements that are helping to combat climate change and promote environmental sustainability.',
    content: `
      <h2>Green Technologies Leading the Charge</h2>
      <p>From renewable energy sources like solar and wind to energy-efficient building materials, sustainable technologies are crucial for reducing our carbon footprint.</p>
    `,
    author: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?u=alex_johnson',
    },
    publishDate: '2026-07-10',
    category: 'Environment',
    thumbnail:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '3',
    slug: 'remote-work-best-practices',
    title: 'Mastering Remote Work: Strategies for Productivity and Well-being',
    excerpt:
      'Practical tips for thriving in a remote work environment, balancing professional responsibilities with personal health.',
    content: `
      <h2>Setting Up for Success</h2>
      <p>Creating a dedicated workspace is the first step to maintaining focus and productivity while working from home.</p>
    `,
    author: {
      name: 'Sarah Lee',
      avatar: 'https://i.pravatar.cc/150?u=sarah_lee',
    },
    publishDate: '2026-07-05',
    category: 'Work Culture',
    thumbnail:
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '4',
    slug: 'blockchain-beyond-crypto',
    title: 'Blockchain Beyond Cryptocurrency: Real-World Applications',
    excerpt:
      'How blockchain technology is transforming industries like supply chain management, voting systems, and digital identity.',
    content: `
      <h2>Securing the Supply Chain</h2>
      <p>Blockchain provides an immutable ledger that can track goods from origin to destination, ensuring transparency and reducing fraud.</p>
    `,
    author: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael_chen',
    },
    publishDate: '2026-06-28',
    category: 'Technology',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f4fc250?auto=format&fit=crop&q=80&w=800&h=400',
  },
];

export const mockJobs: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    description:
      'We are looking for an experienced Frontend Engineer to lead the development of our core web applications using React and Next.js.',
    requirements: [
      '5+ years of experience with React and modern JavaScript',
      'Strong understanding of Next.js and SSR/SSG',
      'Experience with Tailwind CSS and responsive design',
      'Excellent communication skills',
    ],
    responsibilities: [
      'Architect and develop new frontend features',
      'Mentor junior engineers',
      'Collaborate with designers and product managers',
      'Optimize application performance',
    ],
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY or Remote',
    type: 'Full-time',
    description:
      'Join our design team to create intuitive and beautiful user experiences across our product suite.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma and prototyping tools',
      'Strong portfolio showcasing UI/UX skills',
      'Experience working in agile teams',
    ],
    responsibilities: [
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and high-fidelity mockups',
      'Maintain and evolve our design system',
      'Work closely with engineering to ensure design fidelity',
    ],
  },
  {
    id: 'job-3',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'Lead our growth marketing initiatives and brand campaigns to expand our market reach.',
    requirements: [
      '4+ years of B2B marketing experience',
      'Proven track record of successful campaign management',
      'Strong analytical skills (Google Analytics, Mixpanel)',
      'Excellent written and verbal communication',
    ],
    responsibilities: [
      'Develop and execute go-to-market strategies',
      'Manage digital advertising budgets',
      'Collaborate with content and PR teams',
      'Analyze and report on campaign performance',
    ],
  },
  {
    id: 'job-4',
    title: 'Customer Support Specialist',
    department: 'Customer Success',
    location: 'Remote (Global)',
    type: 'Contract',
    description:
      'Help our users get the most out of our platform by providing top-notch technical and product support.',
    requirements: [
      '1-2 years of customer support experience',
      'Familiarity with helpdesk software (Zendesk, Intercom)',
      'High empathy and patience',
      'Ability to troubleshoot technical issues',
    ],
    responsibilities: [
      'Respond to customer inquiries via email and chat',
      'Create and update help center articles',
      'Escalate complex issues to the engineering team',
      'Gather and share customer feedback',
    ],
  },
];

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading-2'; text: string }
  | { type: 'heading-3'; text: string }
  | { type: 'list-bullet'; items: string[] }
  | { type: 'blockquote'; text: string; author?: string }
  | { type: 'code-block'; code: string; language: string }
  | { type: 'callout'; text: string; calloutType: 'info' | 'warning' | 'tip' }
  | { type: 'image'; imageUrl: string; imageAlt: string };

export type MockBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; avatar: string };
  date: string;
  thumbnail: string;
  featured: boolean;
  readingTime: string;
  tags: string[];
  contentBlocks: BlogBlock[];
};

export const MOCK_POSTS: MockBlogPost[] = [
  {
    slug: 'future-of-saas-2027',
    title: 'The Future of SaaS: What to Expect by 2027',
    excerpt:
      'Explore the emerging trends in cloud software, from AI-driven personalization to micro-SaaS ecosystems that are reshaping the industry.',
    category: 'Technology',
    author: { name: 'Sarah Jenkins', avatar: '/avatars/01.png' },
    date: 'Jul 10, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    featured: true,
    readingTime: '5 min read',
    tags: ['SaaS', 'AI', 'Cloud Computing', 'Tech Trends'],
    contentBlocks: [
      {
        type: 'paragraph',
        text: 'The Software-as-a-Service (SaaS) industry is undergoing its most radical transformation since the transition from desktop to cloud. Driven by advancements in artificial intelligence, edge database systems, and zero-latency pipelines, the next generation of cloud software will look and feel fundamentally different by 2027.',
      },
      {
        type: 'heading-2',
        text: 'Autonomous AI Agents as the Interface Standard',
      },
      {
        type: 'paragraph',
        text: 'We are moving rapidly away from the era of simple chat interfaces. By 2027, enterprise SaaS will not just respond to prompts; it will proactively orchestrate workflows using autonomous AI agents. Instead of manually clicking through complex dashboard configurations, business analysts will instruct virtual agents to execute multi-step integrations.',
      },
      {
        type: 'callout',
        text: 'Industry projections show that autonomous agents will handle up to 45% of standard backend operations without human intervention by 2027, leading to a massive increase in operational efficiency.',
        calloutType: 'info',
      },
      {
        type: 'image',
        imageUrl:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
        imageAlt: 'AI and Robotics Workflow Automation',
      },
      {
        type: 'heading-2',
        text: 'The Rise of Micro-SaaS Ecosystems',
      },
      {
        type: 'paragraph',
        text: 'As the cost of engineering descends thanks to generative tools, we are witnessing a boom in niche micro-SaaS solutions. Rather than purchasing bloated, monolithic platforms, organizations will adopt specialized, single-purpose utilities that connect seamlessly through standardized, AI-mapped API gateways.',
      },
      {
        type: 'list-bullet',
        items: [
          'Reduced engineering overhead and localized focus.',
          'Quicker time-to-market and targeted feature development.',
          'Seamless interoperability through self-documenting APIs.',
          'Reduced vendor lock-in for enterprise customers.',
        ],
      },
      {
        type: 'heading-2',
        text: 'Zero-Latency Edge Architecture',
      },
      {
        type: 'blockquote',
        text: 'User experience is directly proportional to load speed. In the modern web ecosystem, latency is a conversion killer. Utilizing edge databases is no longer a luxury; it is a baseline requirement.',
        author: 'Sarah Jenkins, Principal Cloud Architect',
      },
      {
        type: 'paragraph',
        text: 'By serving data from nodes physically located close to users, next-generation SaaS architectures are driving response times down to the single-digit milliseconds. Coupled with real-time replication systems, this ensures absolute consistency and speed across remote-first team setups.',
      },
      {
        type: 'heading-2',
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Adapting to the SaaS landscape of 2027 requires engineering leaders to adopt modular, edge-first architectures and integrate native agentic capabilities today. Those who design for high-performance integrations and absolute clarity will lead the next wave of digital products.',
      },
    ],
  },
  {
    slug: 'mastering-react-server-components',
    title: 'Mastering React Server Components',
    excerpt:
      'A deep dive into how RSCs change the paradigm of fetching data and rendering UI in modern Next.js applications.',
    category: 'Engineering',
    author: { name: 'David Chen', avatar: '/avatars/02.png' },
    date: 'Jun 28, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    featured: false,
    readingTime: '6 min read',
    tags: ['React', 'Next.js', 'Web Development', 'Engineering'],
    contentBlocks: [
      {
        type: 'paragraph',
        text: 'React Server Components (RSC) represent one of the most substantial architectural shifts in React history. By introducing a server-first mindset, RSC allows developers to render components on the server, significantly reducing client-side bundle sizes and rendering latency.',
      },
      {
        type: 'heading-2',
        text: 'The Paradigm Shift: Server vs. Client',
      },
      {
        type: 'paragraph',
        text: 'Traditionally, React rendered components on the client, fetching data via API endpoints in hooks like useEffect. This created waterfall issues and loaded heavy JS bundles. With server components, fetching data directly connects your component to your database or CMS on the server.',
      },
      {
        type: 'code-block',
        language: 'tsx',
        code: `// src/app/services/page.tsx
import { db } from '@/lib/db';

export default async function ServicesPage() {
  // Direct database query on the server!
  const services = await db.service.findMany();

  return (
    <div className="grid grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard key={service.id} item={service} />
      ))}
    </div>
  );
}`,
      },
      {
        type: 'heading-2',
        text: 'Drawing the Client-Server Boundary',
      },
      {
        type: 'paragraph',
        text: 'Understanding where to place client boundaries is critical. Client components are designated using the directive at the top of the file, and should only be used when interactive features or client-only APIs are required.',
      },
      {
        type: 'callout',
        text: 'Use Server Components by default. Restrict client boundaries strictly to interactive elements like forms, modals, toggles, or components relying on hooks (useState, useEffect). This maintains optimal performance.',
        calloutType: 'warning',
      },
      {
        type: 'heading-2',
        text: 'Streaming Content with Suspense',
      },
      {
        type: 'paragraph',
        text: 'One of the greatest benefits of RSC is the ability to stream UI updates. Rather than waiting for slow database calls to complete before rendering the page, Next.js can send static skeletons immediately while streaming slow-rendering blocks asynchronously.',
      },
      {
        type: 'list-bullet',
        items: [
          'Improved Largest Contentful Paint (LCP) scores.',
          'Reduced time-to-first-byte (TTFB) on static layouts.',
          'Simpler code structure without complex state-tracking boilerplate.',
        ],
      },
      {
        type: 'blockquote',
        text: 'Streaming turns page loading from a frustrating all-or-nothing experience into a progressive, fluid transition that keeps users engaged.',
        author: 'David Chen, Lead Software Engineer',
      },
      {
        type: 'heading-2',
        text: 'Summary',
      },
      {
        type: 'paragraph',
        text: 'RSCs are a game-changer for building high-performance Next.js applications. By shifting data fetching closer to the data source and keeping client JS light, they deliver outstanding user experiences and clean code maintenance.',
      },
    ],
  },
  {
    slug: 'designing-for-accessibility',
    title: 'Designing for Accessibility in 2026',
    excerpt:
      'Why inclusive design is no longer optional, and how to implement WCAG 3.0 standards in your next product.',
    category: 'Design',
    author: { name: 'Emma Wilson', avatar: '/avatars/03.png' },
    date: 'Jun 12, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    featured: false,
    readingTime: '4 min read',
    tags: ['UI/UX', 'Accessibility', 'Inclusive Design', 'Web Design'],
    contentBlocks: [
      {
        type: 'paragraph',
        text: 'Web accessibility is moving rapidly from compliance-checking to user-centered inclusive design. With WCAG 3.0 on the horizon, creating digital interfaces that accommodate diverse physical and cognitive capabilities is both a moral obligation and a business driver.',
      },
      {
        type: 'heading-2',
        text: 'The Shift to WCAG 3.0 and the Bronze/Silver/Gold Framework',
      },
      {
        type: 'paragraph',
        text: 'WCAG 3.0 introduces a new scoring model that measures accessibility in a continuous, multi-dimensional format rather than a strict pass-fail check. This shifts the focus from rigid syntax audits to practical user-tested readability and ease of navigation.',
      },
      {
        type: 'callout',
        text: 'WCAG 3.0 uses the APCA (Advanced Perceptual Contrast Algorithm) instead of traditional contrast ratios. APCA evaluates text size, weight, and context to determine actual visual readability.',
        calloutType: 'tip',
      },
      {
        type: 'heading-2',
        text: 'Semantic HTML & Screen Reader Semantics',
      },
      {
        type: 'paragraph',
        text: 'Native HTML tags provide screen readers with semantic meaning automatically. Replacing custom interactive elements constructed with unsemantic divs with correct native elements fixes key accessibility issues out of the box.',
      },
      {
        type: 'list-bullet',
        items: [
          'Always use native elements (<button>, <input>, <nav>) for interactive controls.',
          'Provide clear, descriptive alt text for all informative imagery.',
          'Implement proper ARIA attributes to represent custom, complex UI states.',
          'Structure your document with a logical heading heirarchy (H1 followed by H2s).',
        ],
      },
      {
        type: 'blockquote',
        text: 'An interface designed without semantic layout structure is like an essay written without spaces or paragraphs — technically complete, but impossible to comprehend.',
        author: 'Emma Wilson, Head of UI/UX Design',
      },
      {
        type: 'heading-2',
        text: 'Keyboard Navigability & Clear Focus Indicator States',
      },
      {
        type: 'paragraph',
        text: 'Keyboard navigation is essential for users with motor impairments or those using screen readers. Make sure all interactive items can be navigated in a sequential tab order and feature prominent focus ring styling.',
      },
      {
        type: 'heading-2',
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Inclusive design should be woven into your workflow from wireframing to testing. Implementing WCAG 3.0 guidelines makes your products better, faster, and more readable for everyone.',
      },
    ],
  },
  {
    slug: 'scaling-startup-engineering',
    title: 'Scaling Engineering Teams at Startups',
    excerpt:
      'Lessons learned from growing a team from 5 to 50 engineers while maintaining culture and deployment speed.',
    category: 'Leadership',
    author: { name: 'Michael Ross', avatar: '/avatars/04.png' },
    date: 'May 15, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    featured: false,
    readingTime: '7 min read',
    tags: ['Startup', 'Leadership', 'Team Growth', 'Agile'],
    contentBlocks: [
      {
        type: 'paragraph',
        text: 'Scaling an engineering organization is a delicate balancing act. As a startup expands from a close-knit group of 5 engineers to a structured organization of 50+, communication overhead increases exponentially, and deployment velocity can quickly stall.',
      },
      {
        type: 'heading-2',
        text: 'Velocity vs. Quality: Setting Up Quality Gates',
      },
      {
        type: 'paragraph',
        text: 'To avoid shipping regressions as code volume grows, automated quality controls are vital. Continuous integration (CI) pipelines must act as the ultimate guardrails, validating code formatting, linting rules, type safety, and unit test suites on every pull request.',
      },
      {
        type: 'callout',
        text: 'Automate everything that is mechanical. Your code reviews should focus on system architecture, maintainability, and domain design, rather than arguing over code formatting and missing type declarations.',
        calloutType: 'tip',
      },
      {
        type: 'heading-2',
        text: 'Transitioning to Modular Domain Codebases',
      },
      {
        type: 'paragraph',
        text: 'When 50 engineers edit a single codebase, merge conflicts become a bottleneck. Transitioning to a modular folder structure or microservice boundaries allows teams to work independently on separate features without step-stepping each other.',
      },
      {
        type: 'list-bullet',
        items: [
          'Deconstruct features into separate directories organized by business domain.',
          'Define clear API contracts between services to prevent deep coupling.',
          'Enable squads to deploy their own services independently with robust release testing.',
        ],
      },
      {
        type: 'blockquote',
        text: 'True team autonomy means a squad can deploy a new feature from start to finish without needing to coordinate release windows with three other departments.',
        author: 'Michael Ross, VP of Engineering',
      },
      {
        type: 'heading-2',
        text: 'Implementing the Squad Model',
      },
      {
        type: 'paragraph',
        text: 'Organizing teams around customer value streams rather than technology layers (e.g., separating frontend and backend teams) prevents silo handoffs. Interdisciplinary squads containing product managers, designers, and engineers can own features from end to end.',
      },
      {
        type: 'heading-2',
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Successfully growing an engineering department is less about tooling and more about trust, documentation, and clear architectural boundaries. Build a culture of accountability and automate your deployment checks early.',
      },
    ],
  },
];
