/**
 * Esta pagina envuelve los formularios de autenticacion con un layout centrado y consistente.
 */
import { type ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

/** Layout centrado para paginas de auth. */
export function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <header className="flex justify-end p-4 gap-2 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-sm glass-panel p-6 sm:p-8 space-y-6 shadow-xl border border-white/60 dark:border-white/10 rounded-3xl">
          <h1 className="text-2xl font-black text-center tracking-tight text-foreground">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
