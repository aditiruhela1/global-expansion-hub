import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { COUNTRIES } from "@/utils/countries";
import { toast } from "sonner";

const Auth = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    businessName: "",
    country: COUNTRIES[0].name,
  });

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    document.title = mode === "signup" ? "Sign up — GlobeNest" : "Log in — GlobeNest";
  }, [mode]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.fullName || !form.email || !form.password || !form.businessName) {
          toast.error("Please complete all fields.");
          return;
        }
        await signUp(form);
        toast.success("Welcome to GlobeNest!");
      } else {
        await signIn(form.email, form.password);
        toast.success("Welcome back!");
      }
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: "login" | "signup") {
    setMode(next);
    setParams(next === "signup" ? { mode: "signup" } : {});
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-mesh" />

      <header className="container flex h-16 items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="container flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-elegant backdrop-blur-xl">
            <h1 className="font-display text-3xl font-bold">
              {mode === "signup" ? "Start your global journey" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signup" ? "Create your free GlobeNest account." : "Log in to continue your expansion."}
            </p>

            <div className="mt-6 inline-flex rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${mode === "login" ? "bg-background shadow-card" : "text-muted-foreground"}`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${mode === "signup" ? "bg-background shadow-card" : "text-muted-foreground"}`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Ada Lovelace" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business name</Label>
                    <Input id="businessName" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Home country</Label>
                    <select
                      id="country"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
