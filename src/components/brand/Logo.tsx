import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
          <Globe className="h-5 w-5" strokeWidth={2.5} />
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
