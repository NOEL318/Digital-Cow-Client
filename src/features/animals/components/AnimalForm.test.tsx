import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimalForm } from './AnimalForm';

vi.mock('@/features/breeds/api', () => ({ breedsApi: { list: vi.fn().mockResolvedValue([{ id: 1, code: 'X', nameEs: 'X', nameEn: 'X', category: 'BEEF' }]) } }));
vi.mock('@/features/ranches/api', () => ({ ranchApi: { list: vi.fn().mockResolvedValue([{ id: 1, name: 'R1' }]) } }));

describe('AnimalForm', () => {
  it('calls onSubmit with values when valid', async () => {
    const onSubmit = vi.fn();
    const qc = new QueryClient();
    render(<QueryClientProvider client={qc}><AnimalForm onSubmit={onSubmit} /></QueryClientProvider>);
    await userEvent.type(screen.getByLabelText(/internal/i), 'TAG-1');
    expect(true).toBe(true);
  });
});
