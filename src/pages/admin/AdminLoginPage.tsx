import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/features/admin/api';
import { AuthStorage } from '@/lib/auth-storage';
import { AuthLayout } from '@/pages/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const form = useForm<{ email: string; password: string }>();
  const nav = useNavigate();

  const onSubmit = form.handleSubmit(async v => {
    const t = await adminApi.login(v.email, v.password);
    AuthStorage.setTokens(t.accessToken, t.refreshToken);
    nav('/admin/accounts');
  });

  return (
    <AuthLayout title="Super Admin">
      <form onSubmit={onSubmit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" {...form.register('email')} /></div>
        <div><Label>Password</Label><Input type="password" {...form.register('password')} /></div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
