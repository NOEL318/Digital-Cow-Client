/**
 * Esta pagina muestra el formulario de inicio de sesion para administradores de la plataforma.
 */
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminApi } from '@/features/admin/api';
import { AuthStorage } from '@/lib/auth-storage';
import { AuthLayout } from '@/pages/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Este componente renderiza la pagina de login para el super administrador.
export default function AdminLoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const form = useForm<{ email: string; password: string }>();
  const nav = useNavigate();

  const onSubmit = form.handleSubmit(async v => {
    const tokens = await adminApi.login(v.email, v.password);
    AuthStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    nav('/admin/accounts');
  });

  return (
    <AuthLayout title="Super Admin">
      <form onSubmit={onSubmit} className="space-y-4">
        <div><Label>{t('auth:login.email')}</Label><Input type="email" {...form.register('email')} /></div>
        <div><Label>{t('auth:login.password')}</Label><Input type="password" {...form.register('password')} /></div>
        <Button type="submit" className="w-full">{t('common:labels.signIn')}</Button>
      </form>
    </AuthLayout>
  );
}
