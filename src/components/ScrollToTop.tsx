import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page whenever the route changes.
 * This fixes the issue where users remain at the same scroll position
 * when navigating between different pages.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
