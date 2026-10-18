
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import PaddleShowcase from "@/components/showcase/PaddleShowcase";
import Footer from "@/components/layout/Footer";
import TechnologySection from "@/components/home/TechnologySection";
import StorySection from "@/components/home/StorySection";
import { Suspense } from "react";
import PaddleShowcaseLoader from "@/components/showcase/PaddleShowcaseLoader";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
<HeroSection />
<Suspense
  fallback={
    <section
      id="products"
      className="min-h-[500px] bg-background"
    />
  }
>
  <PaddleShowcaseLoader />
</Suspense>
<TechnologySection />
<StorySection />
<Footer />

      <section
        id="story"
        className="border-t border-white/10 py-20 text-center"
      >
        <p className="font-display text-2xl font-bold">
          APEX PICKLEBALL
        </p>
        <p className="text-muted mt-3 text-sm">
          Own every rally.
        </p>
      </section>
    </main>
  );
}
