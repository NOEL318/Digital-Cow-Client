/**
 * Esta pagina permite al usuario solicitar el envio del correo para restablecer la contrasena.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { authApi } from '@/features/auth/api';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({ email: z.string().email() });

// Este componente renderiza la pagina ForgotPassword.
export default function ForgotPasswordPage() {
  const { t } = useTranslation(['auth']);
  const form = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  const [sent, setSent] = useState(false);

  const onSubmit = form.handleSubmit(async values => {
    await authApi.requestPasswordReset(values.email).catch(() => {});
    setSent(true);
  });

  return (
    <AuthLayout title={t('auth:forgot.title')}>
      {sent ? (
        <p className="text-center">{t('auth:forgot.sent')}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email">{t('auth:login.email')}</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <Button type="submit" className="w-full">{t('auth:forgot.submit')}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
