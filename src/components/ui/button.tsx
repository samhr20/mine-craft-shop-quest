import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-minecraft",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 block-shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 block-shadow",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 block-shadow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        grass: "bg-grass-gradient text-primary-foreground hover:brightness-110 block-shadow border-2 border-minecraft-grass/30",
        dirt: "bg-dirt-gradient text-primary-foreground hover:brightness-110 block-shadow border-2 border-minecraft-dirt/30",
        stone: "bg-stone-gradient text-primary-foreground hover:brightness-110 block-shadow border-2 border-minecraft-stone/30",
        diamond: "bg-minecraft-diamond text-accent-foreground hover:bg-minecraft-diamond/90 block-shadow border-2 border-minecraft-diamond/30",
        gold: "bg-minecraft-gold text-primary-foreground hover:bg-minecraft-gold/90 block-shadow border-2 border-minecraft-gold/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
