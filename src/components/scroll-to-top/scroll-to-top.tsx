import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Don't scroll if we're navigating to a hash anchor
    if (hash) {
      return;
    }

    // The industry standard approach used by most major sites
    const element = document.documentElement || document.body;

    // Disable scroll restoration to prevent browser interference
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Use requestAnimationFrame for better performance and timing
    const scrollToTop = () => {
      element.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    // Double requestAnimationFrame ensures DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });

    // Cleanup: restore scroll restoration when component unmounts
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
