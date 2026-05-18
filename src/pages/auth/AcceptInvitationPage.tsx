import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { http } from '@/lib/http';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { toI18nKey } from '@/lib/i18n';

const schema = z.object({
  fullName: z.string().min(1).max(160),
  password: z.string().min(8).max(100)
});

export default function AcceptInvitationPage() {
  const { t } = useTranslation(['auth', 'errors']);
  const [params] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const form = useForm<{ fullName: string; password: string }>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async values => {
    const token = params.get('token');
    if (!token) return;
    try {
      await http.post(`/team/invitations/${token}/accept`, values);
      nav('/login');
    } catch (e: any) {
      const raw = e?.response?.data?.error?.messageKey ?? 'errors:internal';
      toast.push(t(toI18nKey(raw)), 'destructive');
    }
  });

  return (
    <AuthLayout title={t('auth:accept.title')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="fullName">{t('auth:register.fullName')}</Label>
          <Input id="fullName" {...form.register('fullName')} />
        </div>
        <div>
          <Label htmlFor="password">{t('auth:login.password')}</Label>
          <Input id="password" type="password" {...form.register('password')} />
        </div>
        <Button type="submit" className="w-full">{t('auth:accept.submit')}</Button>
      </form>
    </AuthLayout>
  );
}
