import { motion } from "framer-motion";
import { Globe2, CreditCard, Truck, ListChecks, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "Global Expansion Dashboard",
    desc: "Pick a target country and get a tailored, step-by-step launch checklist.",
  },
  {
    icon: CreditCard,
    title: "International Payments",
    desc: "Connect Stripe, PayPal, Wise, and accept local currencies in minutes.",
  },
  {
    icon: Truck,
    title: "Fulfillment Starter Kit",
    desc: "Recommended carriers per country with cost & profit calculator built in.",
  },
  {
    icon: ListChecks,
    title: "Tax Made Simple",
    desc: "VAT, GST, sales tax — know what to register, where, and when.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Ready",
    desc: "Legal entity, returns policy, translations — covered in your launch flow.",
  },
  {
    icon: BarChart3,
    title: "Track Progress Visually",
    desc: "See completion, blockers, and next steps across every market.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything you need to launch in a new country
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stop juggling 12 tabs, 4 spreadsheets, and a Slack channel called #launch-help.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40 hover:shadow-card"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-0 blur-2xl transition-opacity group-hover:opacity-10" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
