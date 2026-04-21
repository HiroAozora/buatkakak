"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useScene } from "@/lib/sceneStore";

// ─── Character data ─────────────────────────────────────────────────────────
const CHARS = [
  {
    id: "senang",
    src: "/images/char/kak-yipda-senang.png",
    label: "Kakak Senang 😊",
    desc: "Mood: Optimis!",
  },
  {
    id: "sedih",
    src: "/images/char/kak-yipda-sedih.png",
    label: "Kakak Sedih 😢",
    desc: "Mood: Galau...",
  },
  {
    id: "marah",
    src: "/images/char/kak-yipda-marah.png",
    label: "Kakak Marah 😤",
    desc: "Mood: Siap perang!",
  },
];

const FAIL_MSGS = [
  "Yah, revisi lagi 😔",
  "Belum ACC kayaknya…",
  "Coba lagi, bentar lagi bisa!",
  "Dospemnya galak banget 😩",
  "Semangat kak, hampir! 💪",
];

// ─── SVG Path definition ─────────────────────────────────────────────────────
// Viewbox 400×500. Path goes from bottom-left up through curves to top-right (goal)
const PATH_MAIN =
  "M 60 440 L 60 380 A 20 20 0 0 1 80 360 L 260 360 A 20 20 0 0 0 280 340 L 280 260 A 20 20 0 0 0 260 240 L 100 240 A 20 20 0 0 1 80 220 L 80 140 A 20 20 0 0 1 100 120 L 300 120 A 20 20 0 0 0 320 100 L 320 60";

// Fake paths to confuse the user
const PATH_FAKE_1 = "M 280 260 A 20 20 0 0 1 300 240 L 360 240"; // Branches right from middle
const PATH_FAKE_2 = "M 80 220 A 20 20 0 0 0 60 200 L 20 200"; // Branches left
const PATH_FAKE_3 = "M 300 120 L 360 120"; // Branches right at the top

const PATHS = [PATH_MAIN, PATH_FAKE_1, PATH_FAKE_2, PATH_FAKE_3];

// Goal position
const GOAL = { cx: 320, cy: 60, r: 44 };
// Start position
const START = { cx: 60, cy: 440 };

// ─── Utility: get point on SVG path at fraction t ────────────────────────────
function getPathPoint(pathEl: SVGPathElement, t: number) {
  const len = pathEl.getTotalLength();
  return pathEl.getPointAtLength(t * len);
}

// ─── CharSelect screen ────────────────────────────────────────────────────────
function CharSelect({
  onSelect,
}: {
  onSelect: (c: (typeof CHARS)[0]) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [stars, setStars] = useState<
    { x: number; y: number; w: number; o: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        w: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.4 + 0.1,
      })),
    );
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh w-full px-6 py-16"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, #1a0a3c 0%, #07070f 70%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.w,
              height: s.w,
              opacity: s.o,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div className="text-center space-y-2">
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">
            Stage 2
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            pilih{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fda4af, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              karakter kakak
            </span>
          </h2>
          <p className="text-white/40 text-sm font-light">
            siapa yg mw bimbingan skripsi hari ini?
          </p>
        </div>

        {/* Character cards */}
        <div className="flex justify-center gap-3 md:gap-4 w-full px-2">
          {CHARS.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => onSelect(c)}
              onHoverStart={() => setHovered(c.id)}
              onHoverEnd={() => setHovered(null)}
              className="flex flex-col items-center gap-2 p-2 md:p-4 rounded-xl border cursor-pointer select-none flex-1 max-w-[130px]"
              style={{
                background:
                  hovered === c.id
                    ? "rgba(192, 132, 252, 0.15)"
                    : "rgba(255,255,255,0.04)",
                borderColor:
                  hovered === c.id
                    ? "rgba(192,132,252,0.5)"
                    : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
                <Image
                  src={c.src}
                  alt={c.label}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(min-width: 768px) 96px, 64px"
                />
              </div>
              <div className="text-center w-full">
                <p className="text-white text-[10px] md:text-xs font-medium leading-tight px-1">
                  {c.label}
                </p>
                <p className="text-white/40 text-[9px] mt-0.5 truncate px-1">
                  {c.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p
          className="text-white/25 text-xs"
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Tap karakter untuk mulai 👆
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ─── PathGame screen ──────────────────────────────────────────────────────────
function PathGame({ char }: { char: (typeof CHARS)[0] }) {
  const { next } = useScene();

  const [pos, setPos] = useState({ x: START.cx, y: START.cy });
  const [inZone, setInZone] = useState(false);
  const [failMsg, setFailMsg] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    [],
  );
  const trailId = useRef(0);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const sampledPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Pre-calculate path points to avoid heavy SVG getPointAtLength calls during dragging
  useEffect(() => {
    const points: { x: number; y: number }[] = [];
    pathRefs.current.forEach((pathEl) => {
      if (!pathEl) return;
      const len = pathEl.getTotalLength();
      // Sample heavily (approx every 1.5 pixels)
      const samples = Math.ceil(len / 1.5);
      for (let i = 0; i <= samples; i++) {
        const pt = pathEl.getPointAtLength((i / samples) * len);
        points.push({ x: pt.x, y: pt.y });
      }
    });
    sampledPointsRef.current = points;
  }, []);

  // Convert client XY → SVG coordinate
  const clientToSvg = useCallback((cx: number, cy: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  // Find nearest point across ANY pre-sampled path
  const snapToPath = useCallback((svgX: number, svgY: number) => {
    let best = { x: svgX, y: svgY, dist: Infinity };
    const points = sampledPointsRef.current;

    // Fast array iteration instead of SVG DOM calls
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const d = Math.hypot(pt.x - svgX, pt.y - svgY);
      if (d < best.dist) {
        best.x = pt.x;
        best.y = pt.y;
        best.dist = d;
      }
    }

    return best;
  }, []);

  const reset = useCallback((msg: string) => {
    setFailMsg(msg);
    setAttempts((a) => a + 1);
    setTrail([]);
    setTimeout(() => {
      setPos({ x: START.cx, y: START.cy });
      setFailMsg(null);
    }, 1800);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (failMsg || completed) return;
      const { x: svgX, y: svgY } = clientToSvg(clientX, clientY);
      const snapped = snapToPath(svgX, svgY);

      setPos({ x: snapped.x, y: snapped.y });

      // Add trail dot
      setTrail((prev) => {
        const next = [
          ...prev,
          { x: snapped.x, y: snapped.y, id: trailId.current++ },
        ];
        return next.slice(-25);
      });

      // Check out of bounds (keluar jalur)
      // tolerance radius ~40px
      if (snapped.dist > 40) {
        reset("Keluar jalur! 😱");
        return;
      }

      // Check goal
      const distGoal = Math.hypot(snapped.x - GOAL.cx, snapped.y - GOAL.cy);
      if (distGoal < GOAL.r + 10) {
        setCompleted(true);
        setTimeout(() => next(), 1200);
      }
    },
    [failMsg, completed, clientToSvg, snapToPath, reset, next],
  );

  // Pointer events
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <motion.div
      className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse at 30% 60%, #0f1a3c 0%, #07070f 70%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-32 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none">
        <p className="text-white/30 text-xs tracking-widest uppercase">
          Jalur Bimbingan
        </p>
        <h2 className="text-white text-lg font-semibold">
          Lewatin rintangannya, kak! 💪
        </h2>
        {attempts > 0 && (
          <p className="text-rose-400/70 text-xs">
            Percobaan ke-{attempts + 1}
          </p>
        )}
      </div>

      {/* SVG play field */}
      <div className="relative w-full max-w-sm" style={{ aspectRatio: "4/5" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 400 500"
          className="w-full h-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Render all paths (glow and main) */}
          {PATHS.map((p, i) => (
            <g key={i}>
              <path
                d={p}
                stroke="rgba(192,132,252,0.2)"
                strokeWidth="25"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={p}
                stroke="rgba(192,132,252,0.7)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8 6"
              />
            </g>
          ))}

          {/* Trail dots */}
          {trail.map((t, i) => (
            <circle
              key={t.id}
              cx={t.x}
              cy={t.y}
              r={3}
              fill="rgba(253, 164, 175, 0.4)"
              opacity={(i + 1) / trail.length}
            />
          ))}

          {/* Goal: Dospem */}
          <g>
            <circle
              cx={GOAL.cx}
              cy={GOAL.cy}
              r={GOAL.r}
              fill={completed ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.15)"}
              stroke={
                completed ? "rgba(52,211,153,0.9)" : "rgba(239,68,68,0.35)"
              }
              strokeWidth="2"
              strokeDasharray={completed ? "none" : "5 3"}
            />
            <foreignObject
              x={GOAL.cx - 44}
              y={GOAL.cy - 54}
              width={88}
              height={88}
            >
              <div style={{ width: 88, height: 88, position: "relative" }}>
                <img
                  src="/images/char/dospem.png"
                  alt="Dospem"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: completed
                      ? "drop-shadow(0 0 12px rgba(52,211,153,0.8))"
                      : "drop-shadow(0 0 8px rgba(239,68,68,0.6))",
                  }}
                />
              </div>
            </foreignObject>
            <text
              x={GOAL.cx - 50}
              y={GOAL.cy + 4}
              textAnchor="end"
              fill={completed ? "rgba(52,211,153,0.9)" : "rgba(239,68,68,0.7)"}
              fontSize="12"
              fontFamily="system-ui"
              fontWeight="bold"
            >
              {completed ? "ACC!" : "Dospem"}
            </text>
          </g>

          {/* Start label */}
          <text
            x={START.cx}
            y={START.cy + 22}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="9"
            fontFamily="system-ui"
          >
            Mulai
          </text>

          {/* Character — main avatar */}
          {!failMsg && (
            <foreignObject
              x={pos.x - 36}
              y={pos.y - 64}
              width={72}
              height={72}
              style={{ willChange: "transform", overflow: "visible" }}
            >
              <div style={{ width: 72, height: 72, position: "relative" }}>
                <img
                  src={char.src}
                  alt={char.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 12px rgba(192,132,252,0.5))",
                  }}
                />
              </div>
            </foreignObject>
          )}

          {/* Completed burst */}
          {completed && (
            <>
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={GOAL.cx + Math.cos((i * Math.PI) / 4) * 40}
                  cy={GOAL.cy + Math.sin((i * Math.PI) / 4) * 40}
                  r={4}
                  fill="rgba(52,211,153,0.8)"
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Hint */}
      <motion.p
        className="absolute bottom-8 text-white/30 text-xs text-center pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Seret karakter ikutin jalur ungu ✨
      </motion.p>

      {/* Fail popup */}
      <AnimatePresence>
        {failMsg && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="px-6 py-4 rounded-2xl text-center"
              style={{
                background: "rgba(239,68,68,0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0, rotate: [-2, 2, -2, 0] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                rotate: { type: "tween", duration: 0.4 },
              }}
            >
              <p className="text-white text-lg font-semibold">{failMsg}</p>
              <p className="text-white/50 text-xs mt-1">kembali ke awal…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed overlay */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="px-8 py-6 rounded-3xl text-center"
              style={{
                background: "rgba(52,211,153,0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(52,211,153,0.3)",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="text-4xl mb-2">🎓</p>
              <p className="text-white text-xl font-semibold">Berhasil!</p>
              <p className="text-white/60 text-sm mt-1">
                Kakak sampai di tujuan~
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function PathGameScene() {
  const [selectedChar, setSelectedChar] = useState<(typeof CHARS)[0] | null>(
    null,
  );

  return (
    <AnimatePresence mode="wait">
      {!selectedChar ? (
        <motion.div key="select">
          <CharSelect onSelect={setSelectedChar} />
        </motion.div>
      ) : (
        <motion.div key="game">
          <PathGame char={selectedChar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
