import { useEffect } from "react";

const SITE = "Nadun Madusanka";
const DEFAULT_DESCRIPTION =
  "Nadun Madusanka is a software engineer building reliable backend systems, scalable applications and practical software with Java, Spring Boot, PostgreSQL, AWS and DevOps.";

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title?: string, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Software Engineer`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
