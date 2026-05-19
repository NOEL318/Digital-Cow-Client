/**
 * Este archivo contiene un boton que alterna entre el tema claro y oscuro.
 */
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/app/theme';

/** Boton para alternar entre dark y light. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation('common');
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={t('themeToggle')}>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
