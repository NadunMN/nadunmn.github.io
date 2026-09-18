export interface Experience {
  company: string;
  role: string;
  /** ISO month, e.g. "2025-08" */
  start: string;
  /** ISO month, or null while the role is ongoing */
  end: string | null;
  summary: string;
  stack: string[];
}

// Listed chronologically by start date
export const experiences: Experience[] = [
  {
    company: "JDNBrothers",
    role: "Software Engineer",
    start: "2025-08",
    end: null,
    summary:
      "Building the company's transport and logistics management system end to end — REST APIs, data model, frontend, and the pipeline that ships it to production.",
    stack: ["Spring Boot REST APIs", "PostgreSQL", "React", "Docker", "AWS", "GitHub Actions CI/CD"],
  },
  {
    company: "Altria Consulting",
    role: "ERP Technical Consultant — SAP ABAP",
    start: "2025-11",
    end: null,
    summary:
      "Developing and supporting SAP ERP solutions as part of a technical consulting team — ABAP development across S/4HANA, OData services and CDS views.",
    stack: ["SAP ABAP", "SAP S/4HANA", "OData", "CDS Views"],
  },
];

const monthFormat = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

export const formatMonth = (iso: string | null) =>
  iso ? monthFormat.format(new Date(`${iso}-01T00:00:00`)) : "Present";
