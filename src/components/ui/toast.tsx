import { useState, useCallback, type ReactNode, createContext, useContext } from 'react';

interface Toast { id: number; message: string; variant: 'default' | 'destructive'; }
interface Ctx { push: (m: string, v?: Toast['variant']) => void; }
const ToastCtx = createContext<Ctx>({ push: () => {} });

/** Provider de toasts simple en memoria. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((message: string, variant: Toast['variant'] = 'default') => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {items.map(t => (
          <div key={t.id} className={`rounded-md px-4 py-2 text-sm shadow-lg ${t.variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : 'bg-card border'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
