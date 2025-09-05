import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/useSEO";
import { structuredData } from "@/lib/seo";

const Index = () => {
  // Set SEO for home page
  usePageSEO('home', {
    structuredData: [
      structuredData.organization,
      structuredData.website
    ]
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
