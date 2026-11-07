export type LinkableItem = {
  slug: string;
  title: string;
  organization: string;
  dateLabel: string;
  description?: string;
  linkUrl: string | null;
  imageUrl: string | null;
};

export type PortfolioProject = {
  title: string;
  subtitle: string;
  copy: string;
  tags: string[];
  kind: "home" | "space";
  linkUrl: string | null;
  imageUrl: string | null;
};

export type PortfolioLinks = { linkedin: string | null; github: string | null; resume: string | null };

export type PortfolioData = {
  name: string;
  initials: string;
  role: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  skills: string[];
  education: LinkableItem[];
  experience: LinkableItem[];
  projects: PortfolioProject[];
  certificates: LinkableItem[];
  awards: LinkableItem[];
  links: PortfolioLinks;
  tools: string[];
};

export const portfolioData: PortfolioData = {
  name: "Jehan Sadik",
  initials: "JS",
  role: "Computer Science Undergraduate",
  headline: "Full-stack developer focused on delightful, real-world systems.",
  bio: "I build thoughtful digital products at the intersection of software, AI, and design. I enjoy turning curious ideas into useful, reliable experiences.",
  location: "Dhaka, Bangladesh",
  email: "jehan.sadik@example.com",
  skills: ["Software Development", "AI & Computer Vision", "Blockchain", "IoT & Embedded", "Research"],
  education: [
    { slug: "bsc-cse", title: "BSc in Computer Science", organization: "Notre Dame University Bangladesh", dateLabel: "2021 — Ongoing", linkUrl: null, imageUrl: null },
    { slug: "hsc-science", title: "HSC (Science), GPA 5.00", organization: "Notre Dame College", dateLabel: "2018 — 2020", linkUrl: null, imageUrl: null },
    { slug: "ssc-science", title: "SSC (Science), GPA 5.00", organization: "St. Gregory’s High School & College", dateLabel: "2018", linkUrl: null, imageUrl: null },
  ],
  experience: [
    { slug: "aurelius-ceo", title: "Chief Executive Officer", organization: "Aurelius E-sports, Dhaka", dateLabel: "2019 — 2021", description: "Led operations, coordination, and team activities in an esports organization.", linkUrl: null, imageUrl: null },
    { slug: "nducc-assistant-secretary", title: "Assistant Secretary in Technology", organization: "Notre Dame University Computer Club", dateLabel: "2023 — 2024", description: "Supported technology initiatives, student collaboration, and club activities.", linkUrl: null, imageUrl: null },
  ],
  projects: [
    { title: "Gesture-controlled Home", subtitle: "Automation System", copy: "Touchless home automation using Arduino, relay modules, OpenCV, and MediaPipe for real-time hand gesture recognition.", tags: ["Arduino", "OpenCV", "MediaPipe"], kind: "home", linkUrl: null, imageUrl: null },
    { title: "ExoSky", subtitle: "Explore the unknown", copy: "An app concept that lets users view the night sky from exoplanets and create custom constellations using NASA data.", tags: ["Astronomy", "Exoplanets", "NASA API"], kind: "space", linkUrl: null, imageUrl: null },
  ],
  certificates: [
    { slug: "nasa-space-apps", title: "NASA Space Apps Challenge", organization: "ExoSky project showcase", dateLabel: "", linkUrl: null, imageUrl: null },
    { slug: "blockchain-theory", title: "Blockchain Theory and Applications II", organization: "POSTECH / Coursera", dateLabel: "", linkUrl: null, imageUrl: null },
  ],
  awards: [
    { slug: "aurelius-ceo-award", title: "Former CEO of Aurelius E-sports", organization: "Leadership", dateLabel: "", linkUrl: null, imageUrl: null },
    { slug: "nducc-leadership", title: "Assistant Secretary in Technology, Notre Dame University Computer Club", organization: "Leadership", dateLabel: "", linkUrl: null, imageUrl: null },
    { slug: "nasa-participant", title: "NASA Space Apps Challenge participant with ExoSky", organization: "Competition", dateLabel: "", linkUrl: null, imageUrl: null },
    { slug: "academic-award", title: "Strong academic performance with GPA 5.00 in SSC and HSC", organization: "Academic", dateLabel: "", linkUrl: null, imageUrl: null },
  ],
  links: { linkedin: null, github: null, resume: null },
  tools: ["Power BI, SQL, DAX", "OpenCV, Python, YOLO", "React, Next.js, Express, REST API", "Hyperledger Fabric, Docker, Node.js"],
};
