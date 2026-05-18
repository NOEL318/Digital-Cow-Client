import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/features/auth/api';
import { AuthLayout } from './AuthLayout';

/** Llama POST /auth/verify-email con el token del query string. */
export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const { t } = useTranslation('auth');
  const [state, setState] = useState<'pending' | 'ok' | 'fail'>('pending');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setState('fail'); return; }
    authApi.verifyEmail(token).then(() => setState('ok')).catch(() => setState('fail'));
  }, [params]);

  return (
    <AuthLayout title={t('verify.title')}>
      <p className="text-center">
        {state === 'pending' ? '...' : state === 'ok' ? t('verify.success') : t('verify.fail')}
      </p>
    </AuthLayout>
  );
}
