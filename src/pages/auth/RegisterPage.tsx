import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterValues } from '@/features/auth/schemas';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { toI18nKey } from '@/lib/i18n';

/** Pagina de registro: crea cuenta + Owner. */
export default function RegisterPage() {
  const { t, i18n } = useTranslation(['auth', 'errors']);
  const { register: doRegister } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { locale: i18n.language.startsWith('en') ? 'en' : 'es' }
  });

  const onSubmit = form.handleSubmit(async values => {
    try {
      await doRegister(values);
      nav('/dashboard');
    } catch (e: any) {
      const raw = e?.response?.data?.error?.messageKey ?? 'errors:internal';
      toast.push(t(toI18nKey(raw)), 'destructive');
    }
  });

  return (
    <AuthLayout title={t('auth:register.title')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="accountName">{t('auth:register.accountName')}</Label>
          <Input id="accountName" {...form.register('accountName')} />
        </div>
        <div>
          <Label htmlFor="fullName">{t('auth:register.fullName')}</Label>
          <Input id="fullName" {...form.register('fullName')} />
        </div>
        <div>
          <Label htmlFor="email">{t('auth:login.email')}</Label>
          <Input id="email" type="email" {...form.register('email')} />
        </div>
        <div>
          <Label htmlFor="password">{t('auth:login.password')}</Label>
          <Input id="password" type="password" {...form.register('password')} />
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {t('auth:register.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
