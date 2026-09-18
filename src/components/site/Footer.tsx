import { Link } from "react-router-dom";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-ink">
      <div className="shell flex flex-col gap-6 border-t border-paper/15 py-8 md:flex-row md:items-center md:justify-between">
        <p className="label text-paper/50">
          © {year} {profile.name}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <Link to="/works" className="label link-underline">
              All work
            </Link>
          </li>
          <li>
            <Link to="/blog" className="label link-underline">
              Writing
            </Link>
          </li>
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="label link-underline">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="label link-underline self-start text-paper/70 md:self-auto"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
