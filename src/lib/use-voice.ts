import { useCallback, useEffect, useState } from 'react';
import i18n from './i18n';

const STORAGE_KEY = 'digitalcow.voiceEnabled';

/**
 * Hook que expone una funcion speak para leer texto en voz alta usando
 * la Web Speech API. La preferencia "Leer en voz alta" se guarda en
 * localStorage como booleano. Si el navegador no soporta speechSynthesis
 * o la preferencia esta apagada, speak no hace nada.
 */
export function useVoice() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined') return;
      if (!enabled) return;
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = i18n.language?.startsWith('en') ? 'en-US' : 'es-ES';
      synth.speak(utter);
    },
    [enabled]
  );

  return { enabled, setEnabled, speak };
}

/**
 * Variante que siempre intenta hablar (ignora la preferencia global).
 * Util para botones explicitos "escuchar" donde el usuario ya pidio voz.
 */
export function speakNow(text: string): void {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = i18n.language?.startsWith('en') ? 'en-US' : 'es-ES';
  synth.speak(utter);
}
