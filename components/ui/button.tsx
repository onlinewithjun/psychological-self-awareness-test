import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 outline-none ring-offset-background disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background shadow-[0_18px_40px_-28px_rgba(27,44,75,0.5)] hover:translate-y-[-1px] hover:bg-[color:var(--foreground-soft)]",
        secondary:
          "border border-stroke bg-white/70 text-foreground hover:bg-white",
        ghost:
          "text-muted-foreground hover:bg-white/70 hover:text-foreground",
        subtle:
          "border border-stroke/70 bg-panel text-foreground hover:bg-white/95",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
