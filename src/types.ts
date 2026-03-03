export interface PricingInfo {
  basePrice: number;
  discount: number;
  finalPrice: number;
  remainingDiscountSeats: number;
}

export interface CourseModule {
  title: string;
  explanation: string;
  trends: string[];
  exercises: string[];
  caseStudy: {
    title: string;
    scenario: string;
    challenge: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface StudentPerformance {
  id: number;
  email: string;
  topic: string;
  score: number;
  difficulty: string;
  timestamp: string;
}

export const TOPICS = [
  "Digital Marketing Overview",
  "Basics of Marketing",
  "Image Creation With AI",
  "Video Creation and Editing",
  "Text Content & AI Copywriting",
  "Domain & Hosting",
  "WordPress",
  "Business Website Development",
  "Search Engine Optimization (SEO)",
  "Google Algorithm",
  "Keyword Research",
  "Onpage SEO",
  "Offpage SEO",
  "Technical SEO",
  "Local SEO",
  "SEO Audit",
  "SEO Competitor Analysis",
  "Google Search Console",
  "Google Analytics",
  "Search Engine Marketing (SEM)",
  "Search Ads",
  "Display Ads",
  "Youtube Ads (Video Ads)",
  "Google Lead Generation",
  "Shopping Ads",
  "Local Store Visit Ads",
  "Performance Max Campaign",
  "Google Tag Manager",
  "Remarketing & Conversion",
  "PPC Reporting",
  "Social Media Optimization (SMO)",
  "Facebook Page & Group",
  "Instagram Optimization",
  "Instagram Growth Hacking",
  "LinkedIn Profile & Business Page",
  "X Optimization",
  "YouTube Channel Optimization",
  "YouTube SEO",
  "YouTube Monetisation",
  "Social Media Automation",
  "Content Calendar",
  "Facebook Organic Marketing",
  "Instagram Organic Marketing",
  "Viral Marketing",
  "Influencer Marketing",
  "Social Media Marketing (SMM)",
  "Meta Ads",
  "Traffic Ads",
  "Meta Lead Generation",
  "Conversion Ads",
  "Pixel & Retargeting",
  "Social Media Ads Reporting",
  "Email Marketing",
  "Whatsapp Marketing",
  "Calling Marketing",
  "SMS Marketing",
  "Online Reputation Management (ORM)",
  "Funnel",
  "Portfolio & Resume Building",
  "Interview Preparation",
  "AI Prompt Engineering",
  "Generative AI for Business",
  "AI Agents in Marketing",
  "Chatbot Development",
  "Data Analytics with AI",
  "Predictive Marketing",
  "E-commerce Growth Hacking",
  "Dropshipping Basics",
  "Affiliate Marketing",
  "Freelancing Mastery"
];

export const LANGUAGES = [
  { name: 'English', code: 'en-IN' },
  { name: 'Hindi', code: 'hi-IN' },
  { name: 'Bengali', code: 'bn-IN' },
  { name: 'Telugu', code: 'te-IN' },
  { name: 'Marathi', code: 'mr-IN' },
  { name: 'Tamil', code: 'ta-IN' },
  { name: 'Gujarati', code: 'gu-IN' },
  { name: 'Kannada', code: 'kn-IN' },
  { name: 'Odia', code: 'or-IN' },
  { name: 'Malayalam', code: 'ml-IN' }
];
