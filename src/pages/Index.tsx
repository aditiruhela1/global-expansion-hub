import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "GlobeNest — Expand globally, operate locally";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ProblemSolution />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

function CTA() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-12 text-center shadow-elegant md:p-16">
          <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-10" />
          <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold md:text-5xl">
            Your next market is one checklist away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join the founders launching globally without losing sleep.
          </p>
          <a
            href="/auth?mode=signup"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-gradient-primary px-8 text-base font-medium text-primary-foreground shadow-elegant transition-all hover:shadow-glow hover:brightness-110"
          >
            Start Free →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Index;
