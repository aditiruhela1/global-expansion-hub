import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const problems = [
  "12 spreadsheets to track tax registrations",
  "Different payment gateway per region",
  "No idea which carrier to trust abroad",
  "Reading 40-page PDFs from foreign tax authorities",
];
const solutions = [
  "One unified expansion checklist per country",
  "Connect every gateway from a single hub",
  "Vetted carrier shortlists with cost calculator",
  "Plain-English summaries, only what you need",
];

export function ProblemSolution() {
  return (
    <section id="problem" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">The problem</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Going international shouldn't feel like a second startup.
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8"
          >
            <h3 className="font-display text-2xl font-semibold">Without GlobeNest</h3>
            <ul className="mt-6 space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                    <X className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 shadow-elegant"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <h3 className="font-display text-2xl font-semibold">With GlobeNest</h3>
            <ul className="mt-6 space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
