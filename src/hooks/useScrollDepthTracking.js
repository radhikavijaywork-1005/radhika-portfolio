import { useEffect } from "react";

// Umami logs a pageview on route change, but that alone can't tell a 3-second
// bounce apart from someone who actually read the case study. This fires a
// custom "scroll_depth" event the first time a visitor crosses each quartile
// of the page's scrollable height, tagged with which page and how far —
// visible in Umami's Events report per page.
export function useScrollDepthTracking(pageName) {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const fired = new Set();

    const check = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;

      thresholds.forEach((t) => {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          window.umami?.track("scroll_depth", { page: pageName, depth: t });
        }
      });

      if (fired.size === thresholds.length) {
        window.removeEventListener("scroll", check);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pageName]);
}
