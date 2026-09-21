import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/** Raiz del componente Tabs. Wrapper directo del primitive de Radix. */
export const Tabs = TabsPrimitive.Root;

/** Lista horizontal de tabs (trigger container). */
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-start rounded-2xl glass-card p-1.5 gap-1.5 border border-white/60 dark:border-white/10 text-muted-foreground backdrop-blur-xl shadow-sm',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

/** Boton de cambio de tab. Estado activo via data-state=active con alto contraste y gradiente. */
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all duration-150',
      'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-emerald-600/25 data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:font-bold',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

/** Contenido asociado a una tab. Visible cuando su value coincide. */
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
