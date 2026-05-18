import { type ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

/** Layout centrado para paginas de auth. */
export function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-end p-4 gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl font-bold text-center">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
