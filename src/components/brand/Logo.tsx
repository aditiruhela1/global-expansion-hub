import { cn } from "@/lib/utils";
import logoImg from "@/assets/globenest-logo.jpg";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary blur-md opacity-50" />
        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-background shadow-elegant ring-1 ring-border/60">
          <img
            src={logoImg}
            alt="GlobeNest logo"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight">
          Globe<span className="text-gradient">Nest</span>
        </span>
      )}
    </div>
  );
}
