"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScene } from "@/lib/sceneStore";

const LINES = [
  { text: "Selamat yaww…", delay: 500 },
  { text: "Kakak uda berhasil melewati sempro", delay: 1800 },
];

export default function FakeEndingScene() {
  const { next } = useScene();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay));
    });

    // Auto-advance to scene 4 after last line + hold
    timers.push(setTimeout(() => next(), 4000));

    return () => timers.forEach(clearTimeout);
  }, [next]);

  return (
    <motion.div
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden"
      style={{ background: "#07070f" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Blur vignette overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 20%, #07070f 80%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.5 }}
      />

      {/* Soft green glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) translateZ(0)",
          willChange: "transform, opacity",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
      />

      {/* Text sequence */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
        <AnimatePresence>
          {LINES.map((line, i) =>
            visibleCount > i ? (
              <motion.p
                key={i}
                className={
                  i === 0
                    ? "text-white/60 text-xl font-light"
                    : "text-3xl md:text-4xl font-semibold text-white"
                }
                style={
                  i === 1 ? { textShadow: "0 0 40px rgba(52,211,153,0.4)" } : {}
                }
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                {line.text}
              </motion.p>
            ) : null,
          )}
        </AnimatePresence>

        {/* Graduation cap float */}
        {visibleCount >= 2 && (
          <motion.div
            className="text-5xl"
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { type: "spring", stiffness: 300, damping: 18 },
              y: {
                delay: 0.6,
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          >
            🎓
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
