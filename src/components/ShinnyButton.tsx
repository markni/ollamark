import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ButtonProps } from "@/components/ui/button";

interface ShinyButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Animated border using conic gradient */}
        <span className="absolute -inset-[3px] rounded-xl animate-spin z-[-2] bg-[conic-gradient(from_0deg,transparent_70%,rgba(255,255,255,0.8)_80%,transparent_90%)]" />

        {/* Inner background cover */}
        <span className="absolute inset-[3px] rounded-xl bg-inherit z-[-1]" />

        {children}
      </Button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";

export default ShinyButton;
