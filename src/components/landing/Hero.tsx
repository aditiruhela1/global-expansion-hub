import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 -z-20" aria-hidden>
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover opacity-25 dark:opacity-30"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>
      {/* Mesh background */}
      <div className="absolute inset-0 -z-10 bg-hero-mesh" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-primary/5 to-transparent" aria-hidden />

      <div className="container relative pt-20 pb-24 md:pt-32 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Now in open beta — no credit card needed</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Expand globally,{" "}
            <span className="text-gradient">operate locally</span>
            <br />
            <span className="text-muted-foreground text-3xl md:text-5xl font-medium">— without the chaos.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            GlobeNest is the all-in-one launchpad for going international. Payments, tax, and fulfillment —
            sorted in one guided dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/auth?mode=signup">
                Start Free
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href="#features">See how it works</a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Trusted by founders launching in 12+ countries · Setup in under 10 minutes
          </p>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-x-20 -top-10 -bottom-20 -z-10 bg-gradient-primary opacity-20 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-elegant backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-muted-foreground">app.globenest.io/dashboard</span>
            </div>
            <DashboardMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  const plans = [
    { country: "🇩🇪 Germany", progress: 75, status: "Active" },
    { country: "🇬🇧 United Kingdom", progress: 100, status: "Live" },
    { country: "🇯🇵 Japan", progress: 30, status: "Setup" },
  ];
  return (
    <div className="grid gap-4 p-6 md:grid-cols-[200px_1fr]">
      <aside className="hidden flex-col gap-1 md:flex">
        {["Overview", "Expansion Plans", "Payments", "Fulfillment", "Profile"].map((item, i) => (
          <div
            key={item}
            className={`rounded-lg px-3 py-2 text-sm ${i === 1 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
          >
            {item}
          </div>
        ))}
      </aside>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Active markets", value: "3" },
            { label: "Tasks open", value: "12" },
            { label: "MRR uplift", value: "+24%" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-background/50 p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={p.country} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3">
              <div className="flex-1 text-sm font-medium">{p.country}</div>
              <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:block">
                <div className="h-full bg-gradient-primary" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="text-xs font-medium text-muted-foreground">{p.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
