import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For founders exploring their first market.",
    cta: "Start Free",
    features: ["1 expansion plan", "Static checklists", "Tax & shipping basics", "Community support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For teams scaling to 3–5 countries.",
    cta: "Try Pro",
    features: ["Unlimited expansion plans", "Payment integrations", "Profit calculator", "Priority email support", "Export checklists"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    desc: "For high-growth D2C and SaaS brands.",
    cta: "Talk to sales",
    features: ["Everything in Pro", "Dedicated launch advisor", "Custom country playbooks", "API & webhooks", "SSO & audit logs"],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you launch your second market.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-all",
                tier.highlight
                  ? "border-primary/50 bg-card shadow-elegant scale-[1.02]"
                  : "border-border/60 bg-card/50 hover:border-border",
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-elegant">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.highlight ? "hero" : "outline"}
                size="lg"
                className="mt-8"
              >
                <Link to="/auth?mode=signup">{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
