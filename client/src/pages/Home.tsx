import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnimatedShowcase from "@/components/AnimatedShowcase";
import ServicesSection from "@/components/ServicesSection";
import FeaturedBeauticians from "@/components/FeaturedBeauticians";
import HowItWorks from "@/components/HowItWorks";
import BeauticianCTA from "@/components/BeauticianCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AnimatedShowcase />
        <ServicesSection />
        <HowItWorks />
        <FeaturedBeauticians />
        <BeauticianCTA />
      </main>
      <Footer />
    </div>
  );
}
