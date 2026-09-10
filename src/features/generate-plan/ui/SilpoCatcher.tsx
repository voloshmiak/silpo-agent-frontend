import React, { useEffect, useRef, useState } from "react";

type FallingItem = {
  id: number;
  x: number;
  y: number;
  kind: "good" | "bad" | "heart" | "bomb";
  emoji: string;
};

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 220;
const ITEM_SIZE = 28;
const PLAYER_HITBOX_WIDTH = 46;
const PLAYER_HITBOX_HEIGHT = 25;
const ITEM_HITBOX_SIZE = 20;
const BOMB_DAMAGE = 2;
const KEYBOARD_SPEED = 0.07; // % per ms
const ITEM_FALL_SPEED = 0.075;
const SPAWN_INTERVAL = 760;
const SPAWN_MIN_GAP = 18;
const GOOD_PRODUCTS = ["🥦", "🥑", "🌾", "🍗"];
const BAD_PRODUCTS = ["🍩", "🍕", "🍟"];

export const SilpoCatcher: React.FC = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameSession, setGameSession] = useState(0);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [explosion, setExplosion] = useState<{ x: number; y: number; id: number } | null>(null);
  const playerRef = useRef(50);
  const pointerTargetRef = useRef(50);
  const pointerModeRef = useRef(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || !started) return;

    const items: FallingItem[] = [];
    let nextId = 0;
    let lastTime = performance.now();
    let spawnTime = 0;
    let currentScore = 0;
    let currentLives = 3;
    let frame = 0;
    let stopped = false;
    const keys = new Set<string>();

    const spawn = () => {
      if (items.length >= 7) return;
      const roll = Math.random();
      const kind = roll < 0.08 ? "heart" : roll < 0.16 ? "bomb" : roll < 0.58 ? "bad" : "good";
      const products = kind === "good" ? GOOD_PRODUCTS : kind === "bad" ? BAD_PRODUCTS : [kind === "heart" ? "❤️" : "💣"];
      const lanes = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const shuffledLanes = lanes.sort(() => Math.random() - 0.5);
      const lane = shuffledLanes.find(
        (candidate) =>
          items.every((item) => item.y > 34 || Math.abs(item.x - candidate) >= SPAWN_MIN_GAP)
      );
      if (lane === undefined) return;

      items.push({
        id: nextId++,
        x: lane,
        y: -ITEM_SIZE,
        kind,
        emoji: products[Math.floor(Math.random() * products.length)],
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      pointerModeRef.current = false;
      keys.add(event.key);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.key);
    };
    const onWindowBlur = () => keys.clear();
    const onPointerMove = (event: PointerEvent) => {
      const bounds = field.getBoundingClientRect();
      pointerModeRef.current = true;
      pointerTargetRef.current = Math.max(9, Math.min(91, ((event.clientX - bounds.left) / bounds.width) * 100));
    };
    const tick = (time: number) => {
      if (stopped) return;
      const delta = Math.min(40, time - lastTime);
      lastTime = time;
      spawnTime += delta;
      if (spawnTime >= SPAWN_INTERVAL) { spawnTime = 0; spawn(); }

      const direction = Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"));
      const keyboardX = playerRef.current + direction * delta * KEYBOARD_SPEED;
      const nextX = pointerModeRef.current && direction === 0
        ? keyboardX + (pointerTargetRef.current - keyboardX) * 0.2
        : keyboardX;
      playerRef.current = Math.max(9, Math.min(91, nextX));
      setPlayerX(playerRef.current);

      const playerLeft = (playerRef.current / 100) * FIELD_WIDTH - PLAYER_HITBOX_WIDTH / 2;
      const playerTop = FIELD_HEIGHT - 48;
      const playerRight = playerLeft + PLAYER_HITBOX_WIDTH;
      const playerBottom = playerTop + PLAYER_HITBOX_HEIGHT;
      const survivors: FallingItem[] = [];
      for (const item of items) {
        item.y += delta * ITEM_FALL_SPEED;
        const itemLeft = (item.x / 100) * FIELD_WIDTH - ITEM_HITBOX_SIZE / 2;
        const itemRight = itemLeft + ITEM_HITBOX_SIZE;
        const itemTop = item.y + (ITEM_SIZE - ITEM_HITBOX_SIZE) / 2;
        const itemBottom = itemTop + ITEM_HITBOX_SIZE;
        const caught =
          itemLeft < playerRight &&
          itemRight > playerLeft &&
          itemTop < playerBottom &&
          itemBottom > playerTop;
        if (caught) {
          if (item.kind === "good") {
            currentScore += 10;
            setScore(currentScore);
          } else if (item.kind === "heart") {
            currentLives = Math.min(3, currentLives + 1);
            setLives(currentLives);
          } else {
            currentLives -= item.kind === "bomb" ? BOMB_DAMAGE : 1;
            setLives(Math.max(0, currentLives));
            if (item.kind === "bomb") {
              setExplosion({ x: item.x, y: item.y, id: item.id });
              window.setTimeout(() => setExplosion(null), 420);
            }
            if (currentLives <= 0) { stopped = true; setGameOver(true); }
          }
        } else if (item.y < FIELD_HEIGHT + 22) survivors.push(item);
      }
      items.splice(0, items.length, ...survivors);
      setFallingItems([...items]);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);
    field.addEventListener("pointermove", onPointerMove);
    frame = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
      field.removeEventListener("pointermove", onPointerMove);
    };
  }, [gameSession, started]);

  const startGame = () => { setStarted(true); setGameSession((session) => session + 1); };
  const restart = () => {
    playerRef.current = 50;
    pointerTargetRef.current = 50;
    setPlayerX(50); setScore(0); setLives(3); setGameOver(false); setFallingItems([]); setExplosion(null); setStarted(true);
    setGameSession((session) => session + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 text-[11px] font-mono font-bold uppercase">
        <span>Бали <strong className="text-[#FF5C00]">{score}</strong></span>
        <span aria-label={`${lives} життів`}>Життя {"♥".repeat(lives)}{"♡".repeat(3 - lives)}</span>
      </div>
      <div ref={fieldRef} className="relative h-[220px] w-full overflow-hidden rounded-xl border-2 border-[#D8D2C2] bg-[#F4F1E8] touch-none select-none" aria-label="Гра Silpo Catcher. Рухайте тележку стрілками або пальцем">
        <span className="absolute left-3 top-2 text-[9px] font-mono uppercase tracking-widest text-zinc-400">лови корисне</span>
        {!started && <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#ECE8DC]/95 px-6">
          <strong className="font-mono text-sm uppercase">Silpo Catcher</strong>
          <p className="max-w-[230px] text-xs leading-relaxed text-zinc-500">Лови броколі, авокадо, гречку та курочку: вони дають +10 балів. Рідкісне серце повертає життя, а піца й бомба його забирають.</p>
          <button type="button" onClick={startGame} className="rounded-lg border border-black bg-[#D2F832] px-5 py-2.5 text-[11px] font-mono font-bold uppercase shadow-sm">Грати</button>
        </div>}
        {gameOver && <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#ECE8DC]/95">
          <strong className="font-mono text-sm uppercase">Гру завершено</strong><span className="text-xs text-zinc-500">Рахунок: {score}</span>
          <button type="button" onClick={restart} className="rounded-lg border border-black bg-[#D2F832] px-4 py-2 text-[11px] font-mono font-bold uppercase">Ще раз</button>
        </div>}
        <div
          className="absolute bottom-2 -translate-x-1/2 flex h-9 w-[58px] items-center justify-center text-4xl leading-none"
          style={{ left: `${playerX}%` }}
          aria-hidden="true"
        >
          🛒
        </div>
        {fallingItems.map((item) => (
          <span
            key={item.id}
            className="absolute flex h-7 w-7 -translate-x-1/2 items-center justify-center text-2xl leading-none"
            style={{ left: `${item.x}%`, top: `${item.y}px` }}
            aria-hidden="true"
          >
            {item.emoji}
          </span>
        ))}
        {explosion && (
          <span
            key={explosion.id}
            className="silpo-explosion absolute -translate-x-1/2 text-4xl"
            style={{ left: `${explosion.x}%`, top: `${explosion.y}px` }}
            aria-hidden="true"
          >
            💥
          </span>
        )}
      </div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">← → або ведіть пальцем · +10 за корисне · −1 життя за шкідливе</p>
    </div>
  );
};