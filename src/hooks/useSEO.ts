import { useEffect } from 'react';
import { updateSEO, SEOData } from '../lib/seo';

// Custom hook for managing SEO in React components
export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    updateSEO(seoData);
  }, [seoData]);
};

// Hook for page-specific SEO
export const usePageSEO = (pageType: keyof typeof import('../lib/seo').pageSEO, customData?: Partial<SEOData>) => {
  useEffect(() => {
    // Dynamic import to avoid circular dependency
    import('../lib/seo').then(({ pageSEO }) => {
      const baseSEO = pageSEO[pageType];
      const finalSEO = { ...baseSEO, ...customData };
      updateSEO(finalSEO);
    });
  }, [pageType, customData]);
};
