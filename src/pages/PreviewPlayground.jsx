// Standalone preview route for the AI Playground section — NOT wired into
// Home yet. Radhika's explicit rule: don't add this to the live homepage
// until there are at least 3 real entries (currently 1). This route exists
// so the section can be reviewed on its own before that threshold is hit.
import Playground from "../components/Playground";

export default function PreviewPlayground() {
  return (
    <main>
      <Playground />
    </main>
  );
}
