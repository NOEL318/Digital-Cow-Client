/**
 * Esta pagina permite establecer una nueva contrasena usando el token recibido por correo.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { toI18nKey } from '@/lib/i18n';

const schema = z.object({ newPassword: z.string().min(8).max(100) });

// Este componente renderiza la pagina ResetPassword.
export default function ResetPasswordPage() {
  const { t } = useTranslation(['auth', 'errors']);
  const [params] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const form = useForm<{ newPassword: string }>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async values => {
    const token = params.get('token');
    if (!token) return;
    try {
      await authApi.resetPassword(token, values.newPassword);
      nav('/login');
    } catch (e) {
      const err = e as { response?: { data?: { error?: { messageKey?: string } } } };
      const raw = err?.response?.data?.error?.messageKey ?? 'errors:internal';
      toast.push(t(toI18nKey(raw)), 'destructive');
    }
  });

  return (
    <AuthLayout title={t('auth:reset.title')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="newPassword">{t('auth:reset.newPassword')}</Label>
          <Input id="newPassword" type="password" {...form.register('newPassword')} />
        </div>
        <Button type="submit" className="w-full">{t('auth:reset.submit')}</Button>
      </form>
    </AuthLayout>
  );
}
