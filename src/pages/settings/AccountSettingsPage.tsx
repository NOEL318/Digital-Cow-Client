/**
 * Esta pagina permite al Owner/Admin editar el nombre del rancho/cuenta.
 * El idioma vive en la seccion Preferencias para no duplicar el selector;
 * aqui se preserva el idioma por defecto existente sin volver a mostrarlo.
 */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useAccount, useUpdateAccount } from '@/features/account/api';

/** Pagina de configuracion de cuenta (Owner/Admin). */
export default function AccountSettingsPage() {
  const { t } = useTranslation('common');
  const toast = useToast();
  const { data } = useAccount();
  const update = useUpdateAccount();
  const form = useForm<{ name: string }>();

  useEffect(() => {
    if (data) form.reset({ name: data.name });
  }, [data, form]);

  const onSubmit = form.handleSubmit(async values => {
    // Preservamos defaultLocale tal cual: el idioma se gestiona en Preferencias.
    await update.mutateAsync({ name: values.name, defaultLocale: data?.defaultLocale });
    toast.push(t('actions.save'));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="name">{t('labels.accountName')}</Label>
        <Input id="name" {...form.register('name')} />
      </div>
      <Button type="submit" disabled={update.isPending}>{t('actions.save')}</Button>
    </form>
  );
}
