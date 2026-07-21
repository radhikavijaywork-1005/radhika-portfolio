import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Catch-all for any URL that doesn't match a real route — /work (not a
// real page; "Work" is a homepage anchor, not its own route) and stray
// typos/crawled links both used to render nav + footer with a blank gap
// between them, since <Routes> had no fallback and just matched nothing.
export default function NotFound() {
  useDocumentTitle("Page not found — Radhika Vijay");
  return (
    <main className="not-found">
      <span className="not-found__eyebrow">404</span>
      <h1 className="not-found__title">This page doesn't exist</h1>
      <p className="not-found__body">
        The link you followed may be broken, or the page may have moved.
      </p>
      <Link to="/" className="not-found__link">
        Back to home
      </Link>
    </main>
  );
}
