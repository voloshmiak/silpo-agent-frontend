import React, { useState } from "react";
import { Button } from "@/shared/ui";

interface Props {
  onStartOnboarding: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
}

export const WelcomePage: React.FC<Props> = ({ onStartOnboarding, onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSignIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося увійти");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1E8] p-5 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
        <section className="min-h-[520px] bg-[#D2F832] border-2 border-black rounded-2xl p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.3em]">SILPOFIT</span>
            <h1 className="mt-16 max-w-xl text-5xl sm:text-7xl font-black font-mono uppercase leading-[0.9] tracking-tight">
              Плануй їжу. Рухайся до цілі.
            </h1>
          </div>
          <div className="max-w-md space-y-5">
            <p className="text-sm leading-relaxed text-zinc-800">
              Пройдіть короткий onboarding, підключіть «Сільпо» і отримайте тижневий план з меню та кошиком.
            </p>
            <Button variant="outline" size="lg" className="border-black bg-[#F4F1E8]" onClick={onStartOnboarding}>
              Пройти onboarding →
            </Button>
          </div>
        </section>

        <section className="bg-[#ECE8DC] border border-[#D8D2C2] rounded-2xl p-8 sm:p-10 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Для тих, хто вже з нами</span>
          <h2 className="mt-3 text-3xl font-black font-mono uppercase tracking-tight">Увійти</h2>
          <p className="mt-2 text-sm text-zinc-500">Використайте email і пароль з листа.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSignIn}>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
              Email
              <input className="mt-1.5 w-full h-11 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 outline-none focus:border-zinc-500" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
              Пароль
              <input className="mt-1.5 w-full h-11 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 outline-none focus:border-zinc-500" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p className="text-xs text-[#FF5C00] font-semibold">{error}</p>}
            <Button type="submit" variant="lime" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Входимо…" : "Увійти"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
};