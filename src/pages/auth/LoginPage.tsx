/**
 * Esta pagina muestra el formulario de inicio de sesion del usuario final.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { toI18nKey } from '@/lib/i18n';

/** Pagina de login. */
export default function LoginPage() {
  const { t } = useTranslation(['auth', 'errors']);
  const { login } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = form.handleSubmit(async values => {
    try {
      await login(values.email, values.password);
      // Navega directo a la pantalla principal de la app en lugar de pasar por /dashboard
      // que solo es un redirect, evitando un salto adicional.
      nav('/inicio');
    } catch (e) {
      const err = e as { response?: { data?: { error?: { messageKey?: string } } } };
      const raw = err?.response?.data?.error?.messageKey ?? 'errors:auth.invalidCredentials';
      toast.push(t(toI18nKey(raw)), 'destructive');
    }
  });

  // Helper que devuelve el mensaje de error formateado para mostrarlo bajo cada campo.
  const fieldError = (name: keyof LoginValues): string | null => {
    const err = form.formState.errors[name];
    return err?.message ? String(err.message) : null;
  };

  return (
    <AuthLayout title={t('auth:login.title')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">{t('auth:login.email')}</Label>
          <Input id="email" type="email" {...form.register('email')} />
          {fieldError('email') ? (
            <p role="alert" className="text-xs text-destructive mt-1">{fieldError('email')}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="password">{t('auth:login.password')}</Label>
          <Input id="password" type="password" {...form.register('password')} />
          {fieldError('password') ? (
            <p role="alert" className="text-xs text-destructive mt-1">{fieldError('password')}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {t('auth:login.submit')}
        </Button>
        <div className="text-sm text-center space-y-1">
          <div><Link to="/forgot-password" className="underline">{t('auth:login.forgot')}</Link></div>
          <div>{t('auth:login.noAccount')} <Link to="/register" className="underline">{t('auth:login.register')}</Link></div>
        </div>
      </form>
    </AuthLayout>
  );
}
