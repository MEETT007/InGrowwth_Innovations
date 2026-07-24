import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-[0.98]',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:scale-[0.98]',
        ghost: 'hover:bg-muted hover:text-foreground active:scale-[0.98]',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
        glass:
          'backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-black/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] active:scale-[0.98]',
        gradient:
          'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-90 shadow-md transition-all duration-300 active:scale-[0.98]',
      },
      size: {
        default: "h-10 gap-2 px-5 text-sm rounded-xl [&_svg:not([class*='size-'])]:size-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base rounded-xl [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 rounded-xl [&_svg:not([class*='size-'])]:size-4",
        'icon-xs': "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': "size-9 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isCustomRender = 'render' in props && props.render !== undefined;
  const shouldBeNative = props.nativeButton ?? (isCustomRender ? false : true);

  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={shouldBeNative}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <Loader2
          className={cn(
            'animate-spin shrink-0',
            size === 'xs' || size === 'icon-xs'
              ? 'size-3'
              : size === 'sm' || size === 'icon-sm'
                ? 'size-3.5'
                : size === 'lg' || size === 'icon-lg'
                  ? 'size-5'
                  : 'size-4'
          )}
        />
      )}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
