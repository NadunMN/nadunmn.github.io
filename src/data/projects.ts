import { asset } from "@/lib/asset";
import vpnContent from "@/works/vpn.md?raw";
import kottuLabsContent from "@/works/kottuLabs.md?raw";
import brainMapContent from "@/works/brainMap.md?raw";

export interface ArchitectureTier {
  label: string;
  nodes: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  role: string;
  year: string;
  summary: string;
  tech: string[];
  featured: boolean;
  image?: { src: string; width: number; height: number };
  /** Used to draw a schematic cover when no screenshot exists */
  schematic: { code: string; core: string; modules: string[] };
  links?: { label: string; href: string }[];
  caseStudy: {
    problem: string;
    solution: string;
    contributions: string[];
    outcome: string[];
    architecture: ArchitectureTier[];
  };
  /** Long-form technical notes rendered as markdown */
  content?: string;
}

export const projects: Project[] = [
  {
    slug: "jdn-transport-logistics",
    title: "JDN Transport & Logistics Management System",
    category: "Operations platform",
    role: "Software Engineer",
    year: "2025 — Present",
    summary:
      "An operations platform for JDNBrothers that brings fleet, transport, finance and inventory management into a single system.",
    tech: ["Spring Boot", "React", "PostgreSQL", "AWS", "Docker", "GitHub Actions"],
    featured: true,
    schematic: { code: "JDN/TLMS", core: "Spring Boot API", modules: ["Fleet", "Transport", "Finance", "Inventory"] },
    caseStudy: {
      problem:
        "A transport and logistics business runs on many moving parts at once — vehicles, trips, payments and stock. When that information lives in separate records, everyday decisions depend on manual reconciliation and no one has a complete picture of operations.",
      solution:
        "A single web platform organised into fleet, transport, finance and inventory modules. A Spring Boot REST API owns the business logic on top of a PostgreSQL data model, a React client serves the operations team, and every release is containerised with Docker and shipped to AWS through GitHub Actions.",
      contributions: [
        "Designed and built the Spring Boot REST API and service layer",
        "Modelled the relational schema in PostgreSQL",
        "Built the React interface used for day-to-day operations",
        "Containerised the application with Docker and deployed it to AWS",
        "Automated build and deployment with GitHub Actions",
      ],
      outcome: [
        "Fleet, transport, finance and inventory handled in one system instead of disconnected records",
        "A repeatable, automated path from commit to production on AWS",
      ],
      architecture: [
        { label: "Client", nodes: ["React web app"] },
        { label: "Service", nodes: ["Spring Boot REST API", "Fleet", "Transport", "Finance", "Inventory"] },
        { label: "Data", nodes: ["PostgreSQL"] },
        { label: "Delivery", nodes: ["GitHub Actions", "Docker", "AWS"] },
      ],
    },
  },
  {
    slug: "brainmap",
    title: "BrainMap",
    category: "Mentoring platform",
    role: "Full-Stack Engineer · Team project",
    year: "2025",
    summary:
      "A platform that connects project teams with verified domain experts — with real-time chat, Kanban boards, video meetings and payments built in.",
    tech: ["Next.js", "React", "Spring Boot", "Java", "PostgreSQL", "Docker", "AWS"],
    featured: true,
    image: { src: asset("Images/brainmap.webp"), width: 1280, height: 718 },
    schematic: { code: "BRAINMAP", core: "Spring Boot API", modules: ["Experts", "Projects", "Chat", "Payments"] },
    links: [{ label: "GitHub", href: "https://github.com/brain-Map" }],
    caseStudy: {
      problem:
        "Finding the right mentor for a specific project domain is difficult. Even once you find one, coordinating communication, managing tasks, handling payments and tracking progress means juggling several disconnected tools.",
      solution:
        "BrainMap combines expert discovery, project management, real-time communication and secure payments in one role-based platform. A Java 21 / Spring Boot 3.5 backend exposes a versioned REST API and STOMP WebSocket endpoints, and a Next.js 15 frontend gives admins, moderators, project members and domain experts their own dashboards.",
      contributions: [
        "Full-stack development across the Spring Boot backend and Next.js frontend",
        "REST API design with DTOs, pagination and OpenAPI documentation",
        "PostgreSQL data modelling with Spring Data JPA and Hibernate",
        "Containerisation with Docker and deployment on AWS",
      ],
      outcome: [
        "The full mentorship lifecycle — find an expert, run the project, pay for services — in one place",
        "A moderator verification pipeline that validates expert credentials",
        "Real-time private and group chat with notifications over WebSockets",
      ],
      architecture: [
        { label: "Client", nodes: ["Next.js 15", "React 19", "TypeScript"] },
        { label: "Service", nodes: ["Spring Boot REST API", "WebSocket · STOMP", "Spring Security"] },
        { label: "Data", nodes: ["PostgreSQL"] },
        { label: "Integrations", nodes: ["Supabase Auth", "PayHere", "Jitsi Meet"] },
      ],
    },
    content: brainMapContent,
  },
  {
    slug: "ai-code-review-assistant",
    title: "AI Code Review Assistant",
    category: "Developer tool",
    role: "Software Engineer",
    year: "2026",
    summary:
      "An AI-assisted reviewer that analyses source code and returns structured, actionable feedback — so developers catch issues earlier and review faster.",
    tech: ["AI APIs", "Spring Boot", "React", "Code analysis"],
    featured: true,
    schematic: { code: "AI/REVIEW", core: "Review engine", modules: ["Source", "Analysis", "Model", "Feedback"] },
    caseStudy: {
      problem:
        "Code review is essential but slow. Reviewers are busy, feedback arrives late, and the same kinds of issues get pointed out again and again — time that could be spent on design and logic.",
      solution:
        "A React interface where developers submit code, backed by a Spring Boot service that prepares it for analysis, sends it to an AI model with review-focused instructions, and returns clear, structured feedback.",
      contributions: [
        "Designed the Spring Boot service that orchestrates analysis and model calls",
        "Built the React review interface",
        "Shaped the prompts and response format for consistent, readable feedback",
      ],
      outcome: [
        "Fast first-pass feedback before a human review",
        "Consistent suggestions developers can act on directly",
      ],
      architecture: [
        { label: "Client", nodes: ["React UI"] },
        { label: "Service", nodes: ["Spring Boot API", "Code analysis"] },
        { label: "AI", nodes: ["AI model API"] },
        { label: "Output", nodes: ["Structured review feedback"] },
      ],
    },
  },
  {
    slug: "kottulabs",
    title: "KottuLabs",
    category: "Restaurant management",
    role: "Full-Stack Developer · Team project",
    year: "2024",
    summary:
      "A web-based restaurant management system for multi-branch operations, streamlining reservations, orders, payments and reporting for customers and staff.",
    tech: ["PHP", "MySQL", "JavaScript", "Docker"],
    featured: false,
    image: { src: asset("Images/kottulabs.webp"), width: 1245, height: 700 },
    schematic: { code: "KOTTU/LABS", core: "PHP MVC", modules: ["Orders", "Reservations", "Kitchen", "Reports"] },
    caseStudy: {
      problem:
        "Multi-branch restaurants coordinate reservations, orders, kitchen work, payments and reporting across many people and roles — often with a mix of paper and disconnected tools.",
      solution:
        "A web application built on a PHP MVC architecture with MySQL that gives customers, chefs, stewards, managers and administrators role-specific tools — from PIN-confirmed reservations and order tracking to PayHere payments and branch analytics.",
      contributions: [
        "Feature development on the PHP MVC codebase",
        "MySQL data modelling for orders, meals, reservations and users",
        "Role-based access control across five user types",
      ],
      outcome: [
        "Reservations, orders, payments and reporting in a single role-based system",
        "Branch-level and system-wide analytics for managers and administrators",
      ],
      architecture: [
        { label: "Client", nodes: ["HTML · CSS · JavaScript"] },
        { label: "Service", nodes: ["PHP MVC controllers"] },
        { label: "Data", nodes: ["MySQL"] },
        { label: "Integrations", nodes: ["PayHere"] },
      ],
    },
    content: kottuLabsContent,
  },
  {
    slug: "private-vpn",
    title: "Private VPN",
    category: "Infrastructure",
    role: "Solo project",
    year: "2026",
    summary:
      "A self-hosted WireGuard VPN on a DigitalOcean Ubuntu 22.04 droplet — firewall rules, hardened SSH, client keys and verified encrypted tunnelling.",
    tech: ["WireGuard", "Ubuntu", "DigitalOcean", "Networking", "Security"],
    featured: false,
    image: { src: asset("Images/private-vpn.webp"), width: 1600, height: 900 },
    schematic: { code: "WG/VPN", core: "WireGuard", modules: ["Client", "Tunnel", "Firewall", "Droplet"] },
    caseStudy: {
      problem:
        "Public networks expose traffic and IP addresses, while commercial VPNs require trusting a third party with that traffic.",
      solution:
        "A private WireGuard server on a DigitalOcean droplet running Ubuntu 22.04, with firewall rules at both the cloud and host level, key-based SSH access, generated client keys, and encrypted tunnelling verified through live handshake monitoring.",
      contributions: [
        "Provisioned and hardened the Ubuntu server",
        "Configured DigitalOcean and UFW firewall rules",
        "Generated keys and configured server and client peers",
        "Documented the full setup as a step-by-step guide",
      ],
      outcome: ["A private, encrypted tunnel under my own control", "A repeatable, documented setup"],
      architecture: [
        { label: "Client", nodes: ["WireGuard client"] },
        { label: "Network", nodes: ["Encrypted tunnel · UDP 51820"] },
        { label: "Server", nodes: ["DigitalOcean droplet", "Ubuntu 22.04", "WireGuard"] },
        { label: "Security", nodes: ["UFW", "SSH keys"] },
      ],
    },
    content: vpnContent,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
