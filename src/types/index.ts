export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML string
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string; // ISO format or localized string
  category: string;
  thumbnail: string;
  isFeatured?: boolean;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  responsibilities: string[];
}
