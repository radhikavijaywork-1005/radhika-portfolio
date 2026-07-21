import Work from "../components/Work";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// A real destination for /work (previously blank if visited directly —
// the nav's "Work" link intentionally anchors to the homepage section,
// which stays as-is, but the URL itself needs to lead somewhere real).
// Reuses the exact same Work component/data as the homepage section, so
// there's one source of truth for the project list rather than a
// duplicated card grid that can drift out of sync.
export default function WorkPage() {
  useDocumentTitle("Work — Radhika Vijay");
  return (
    <main>
      <Work />
    </main>
  );
}
