import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [0, 16]);
  const bg = useTransform(scrollY, [0, 100], ["hsl(var(--background) / 0)", "hsl(var(--background) / 0.7)"]);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      style={{ backdropFilter: blur.get() ? `blur(${blur.get()}px)` : undefined, background: bg }}
      className="sticky top-0 z-50 w-full border-b border-transparent transition-colors"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="GlobeNest home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#problem" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why GlobeNest</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button onClick={() => navigate("/dashboard")} variant="hero" size="sm">Dashboard</Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/auth?mode=signup">Start Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
