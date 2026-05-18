import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/AuthContext';
import { http } from '@/lib/http';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';

/**
 * Edita el nombre del usuario actual. El idioma vive en la
 * seccion Preferencias para evitar duplicar el selector.
 */
export default function ProfileSettingsPage() {
  const { user, refreshMe } = useAuth();
  const { t } = useTranslation('common');
  const toast = useToast();
  const form = useForm<{ fullName: string }>({
    defaultValues: { fullName: user?.fullName ?? '' }
  });

  const onSubmit = form.handleSubmit(async values => {
    await http.patch('/me', values);
    await refreshMe();
    toast.push(t('actions.save'));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="fullName">Nombre</Label>
        <Input id="fullName" {...form.register('fullName')} />
      </div>
      {user?.email ? (
        <div className="text-sm text-muted-foreground">
          Correo: <span className="font-medium text-foreground">{user.email}</span>
        </div>
      ) : null}
      <Button type="submit">{t('actions.save')}</Button>
    </form>
  );
}
