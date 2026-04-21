"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LINES = [
  { text: "buat kak yipdaa..", delay: 600, highlight: false, soft: false },
  {
    text: "semprotulation kakakk 🎓",
    delay: 1600,
    highlight: false,
    soft: false,
  },
  { text: "terus juga hari ini…", delay: 2600, highlight: false, soft: false },
  {
    text: "Baarakallahu fii umrik kak yipdaa cantiq. 🎉",
    delay: 3600,
    highlight: true,
    soft: false,
  },
  {
    text: "semoga segala do'a dikabulkan dengan jawaban terindah",
    delay: 5200,
    highlight: false,
    soft: true,
  },
];

export default function FinalMessageScene() {
  const [visible, setVisible] = useState<number[]>([]);
  const fired = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisible((v) => [...v, i]);

          if (line.highlight && !fired.current) {
            fired.current = true;
            import("canvas-confetti").then(({ default: confetti }) => {
              confetti({
                particleCount: 140,
                spread: 90,
                origin: { y: 0.5 },
                colors: ["#fda4af", "#c084fc", "#818cf8", "#34d399", "#fbbf24"],
              });
              setTimeout(
                () =>
                  confetti({
                    particleCount: 80,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.6 },
                    colors: ["#fda4af", "#fbbf24"],
                  }),
                300,
              );
              setTimeout(
                () =>
                  confetti({
                    particleCount: 80,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.6 },
                    colors: ["#c084fc", "#818cf8"],
                  }),
                500,
              );
            });
          }
        }, line.delay),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #1e0a3c 0%, #0d0520 55%, #07070f 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-rose-900/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full bg-violet-900/20 blur-3xl pointer-events-none" />

      {/* Text */}
      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-lg w-full">
        {LINES.map((line, i) => (
          <AnimatePresence key={i}>
            {visible.includes(i) && (
              <motion.p
                className={
                  line.highlight
                    ? "text-2xl md:text-3xl font-bold leading-snug"
                    : line.soft
                      ? "text-base md:text-lg font-light leading-relaxed text-white/50"
                      : "text-lg md:text-xl font-medium text-white/80"
                }
                style={
                  line.highlight
                    ? {
                        background:
                          "linear-gradient(135deg, #fda4af, #c084fc, #818cf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 24px rgba(192,132,252,0.5))",
                      }
                    : {}
                }
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                {line.text}
              </motion.p>
            )}
          </AnimatePresence>
        ))}
      </div>



      {/* Floating hearts */}
      {["💜", "🌸", "✨", "💫", "🎉", "💜"].map((e, i) => (
        <motion.div
          key={i}
          className="absolute text-xl pointer-events-none"
          style={{ left: `${12 + i * 15}%`, bottom: "6%" }}
          animate={{ y: [0, -100, -200], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: i * 0.9,
            ease: "easeOut",
          }}
        >
          {e}
        </motion.div>
      ))}
    </motion.div>
  );
}
