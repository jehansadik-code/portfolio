export const portfolioData = {
  name: "Jehan Sadik",
  initials: "JS",
  role: "Computer Science Undergraduate",
  headline: "Full-stack developer focused on delightful, real-world systems.",
  bio: "I build thoughtful digital products at the intersection of software, AI, and design. I enjoy turning curious ideas into useful, reliable experiences.",
  location: "Dhaka, Bangladesh",
  email: "jehan.sadik@example.com",
  skills: ["Software Development", "AI & Computer Vision", "Blockchain", "IoT & Embedded", "Research"],
  education: [
    ["BSc in Computer Science", "Notre Dame University Bangladesh", "2021 — Ongoing"],
    ["HSC (Science), GPA 5.00", "Notre Dame College", "2018 — 2020"],
    ["SSC (Science), GPA 5.00", "St. Gregory’s High School & College", "2018"],
  ],
  experience: [
    ["Chief Executive Officer", "Aurelius E-sports, Dhaka", "2019 — 2021", "Led operations, coordination, and team activities in an esports organization."],
    ["Assistant Secretary in Technology", "Notre Dame University Computer Club", "2023 — 2024", "Supported technology initiatives, student collaboration, and club activities."],
  ],
  projects: [
    { title: "Gesture-controlled Home", subtitle: "Automation System", copy: "Touchless home automation using Arduino, relay modules, OpenCV, and MediaPipe for real-time hand gesture recognition.", tags: ["Arduino", "OpenCV", "MediaPipe"], kind: "home" },
    { title: "ExoSky", subtitle: "Explore the unknown", copy: "An app concept that lets users view the night sky from exoplanets and create custom constellations using NASA data.", tags: ["Astronomy", "Exoplanets", "NASA API"], kind: "space" },
  ],
  tools: ["Power BI, SQL, DAX", "OpenCV, Python, YOLO", "React, Next.js, Express, REST API", "Hyperledger Fabric, Docker, Node.js"],
} as const;

export type PortfolioData = typeof portfolioData;
