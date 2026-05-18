import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '@/lib/http';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';

/** Pagina de configuracion de cuenta (Owner/Admin). */
export default function AccountSettingsPage() {
  const { t } = useTranslation('common');
  const toast = useToast();
  const form = useForm<{ name: string; defaultLocale: 'es' | 'en' }>();

  useEffect(() => {
    http.get('/account').then(r => form.reset({ name: r.data.name, defaultLocale: r.data.defaultLocale }));
  }, [form]);

  const onSubmit = form.handleSubmit(async values => {
    await http.patch('/account', values);
    toast.push(t('actions.save'));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="name">Account name</Label>
        <Input id="name" {...form.register('name')} />
      </div>
      <div>
        <Label htmlFor="locale">Default locale</Label>
        <select id="locale" {...form.register('defaultLocale')} className="w-full h-10 rounded-md border border-input bg-background px-3">
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>
      <Button type="submit">{t('actions.save')}</Button>
    </form>
  );
}
