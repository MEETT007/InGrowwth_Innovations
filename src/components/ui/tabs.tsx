'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'group/tabs-list inline-flex items-center justify-center rounded-2xl p-1.5 bg-slate-900/90 dark:bg-zinc-900/90 border border-white/10 shadow-inner',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none',
        // Inactive state: clearly legible light text, never dim or washed out
        'text-zinc-300 hover:text-white hover:bg-white/10 dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10',
        // Focus state
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        // Active states across Base UI (data-selected, aria-selected) and Radix UI (data-[state=active])
        'data-selected:bg-gradient-to-r data-selected:from-indigo-600 data-selected:to-purple-600 data-selected:text-white data-selected:font-bold data-selected:shadow-md data-selected:shadow-indigo-500/25 data-selected:border-indigo-400/30',
        'aria-selected:bg-gradient-to-r aria-selected:from-indigo-600 aria-selected:to-purple-600 aria-selected:text-white aria-selected:font-bold aria-selected:shadow-md aria-selected:shadow-indigo-500/25 aria-selected:border-indigo-400/30',
        'data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/25 data-[state=active]:border-indigo-400/30',
        'data-active:bg-gradient-to-r data-active:from-indigo-600 data-active:to-purple-600 data-active:text-white data-active:font-bold data-active:shadow-md data-active:shadow-indigo-500/25 data-active:border-indigo-400/30',
        'disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
