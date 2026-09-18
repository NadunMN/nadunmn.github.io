import { asset } from "@/lib/asset";

export const profile = {
  name: "Nadun Madusanka",
  shortName: "Nadun",
  title: "Software Engineer",
  statement: "I build reliable backend systems, scalable applications, and practical software solutions.",
  tagline: ["Computer Science Graduate", "Software Engineer", "Backend", "Cloud", "DevOps"],
  availability: "Open to opportunities",
  location: "Sri Lanka",
  email: "nadunmaddepola@gmail.com",
  // Place the CV at public/resume.pdf
  cv: asset("resume.pdf"),
  portrait: {
    src: asset("Images/portrait-1080.webp"),
    srcSet: `${asset("Images/portrait-640.webp")} 640w, ${asset("Images/portrait-1080.webp")} 1080w`,
    width: 1080,
    height: 1416,
  },
  socials: [
    { label: "GitHub", href: "https://github.com/NadunMN" },
    { label: "LinkedIn", href: "https://linkedin.com/in/nadun-madusanka-mn" },
    { label: "Instagram", href: "https://www.instagram.com/nadu_nm/" },
  ],
};

export const marqueeItems = [
  "Java",
  "Spring Boot",
  "Python",
  "AWS",
  "Docker",
  "PostgreSQL",
  "REST APIs",
  "DevOps",
  "React",
  "Next.js",
  "SAP ABAP",
  "AI",
];

export const highlights = [
  { value: "1+", label: "Year of professional software engineering experience" },
  { value: "02", label: "Industry roles held in parallel — product engineering and enterprise ERP" },
  { value: "03", label: "Core ecosystems — Java & Spring, TypeScript & React, SAP ABAP" },
  { value: "∞", label: "Problems left to solve" },
];

export const expertise = [
  { area: "Backend", items: ["Java", "Spring Boot", "Python", "REST APIs"] },
  { area: "Database", items: ["PostgreSQL", "MySQL", "JPA", "Hibernate"] },
  { area: "Cloud & DevOps", items: ["AWS", "Docker", "GitHub Actions", "Linux", "CI/CD"] },
  { area: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { area: "Enterprise", items: ["SAP ABAP", "SAP S/4HANA", "OData", "CDS"] },
  { area: "AI", items: ["AI APIs", "AI-powered applications"] },
];

export const education = {
  institution: "University of Colombo School of Computing",
  degree: "BSc in Computer Science",
  status: "Graduate",
};
