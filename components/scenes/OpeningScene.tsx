"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScene } from "@/lib/sceneStore";
import MusicCard from "@/components/ui/MusicCard";

// ── Stars ────────────────────────────────────────────────────────────────────
type Star = { id: number; x: number; y: number; size: number; delay: number; dur: number };

function Stars() {
  const [stars, setStars] = useState<Star[]>([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.5,
        delay: Math.random() * 5,
        dur: Math.random() * 3 + 2,
      })),
    );
  }, []);
  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.85, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
export default function OpeningScene() {
  const { next, toggleAudio } = useScene();

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleAudio();
      next(); // Langsung transisi ke scene selanjutnya
    },
    [toggleAudio, next],
  );

  return (
    <motion.div
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 25%, #1e0a3c 0%, #0d0520 45%, #07070f 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Stars />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-rose-900/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-900/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-5 w-full max-w-xs">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/35 text-[10px] tracking-[0.35em] uppercase mb-2">buat</p>
          <h1
            className="text-3xl font-bold text-white"
            style={{ textShadow: "0 0 60px rgba(232,121,249,0.2)" }}
          >
            kakak{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fda4af, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              sekbid pdd
            </span>
          </h1>
        </motion.div>

        {/* Card */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          <MusicCard
            onPlay={handlePlay}
            albumSrc="/images/kakak/bersama kak ripda.jpg"
            title="buat kak ripdaa"
            subtitle="lagu spesial 🎵"
          />
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #07070f, transparent)" }}
      />
    </motion.div>
  );
}
