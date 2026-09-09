import { useCallback, useEffect, useRef, useState } from "react";

const FALLBACK_MESSAGE = "Не вдалося завантажити дані. Перевірте зʼєднання та спробуйте ще раз.";

/**
 * Завантаження даних екрана з трьома чесними станами: вантажимо, показуємо,
 * не змогли.
 *
 * Четвертого стану — «підставили правдоподібні цифри» — тут навмисно немає.
 * Демо-дані на місці справжніх виглядають як робочий екран, тож людина ухвалює
 * рішення за чужими числами й не бачить причини їх перевірити. Коли запит
 * впав, сторінка лишається скелетоном, а причина стоїть знизу.
 */
export function useLoadedData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Лічильник спроб — єдина залежність ефекту, тож перезапит керований. */
  const [attempt, setAttempt] = useState(0);

  // Фетчер приходить інлайновою стрілкою і міняє ідентичність на кожному
  // рендері. У залежностях ефекту це був би нескінченний цикл запитів.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;

    fetcherRef
      .current()
      .then((value) => {
        if (!cancelled) setData(value);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : FALLBACK_MESSAGE);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    // Відповідь скасованої спроби не має перетирати свіжішу
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
  }, []);

  return { data, setData, isLoading, error, reload };
}
