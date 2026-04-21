"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Props = {
  playing: boolean;
  onToggle: (e: React.MouseEvent) => void;
  visible?: boolean;
};

export default function DynamicIsland({
  playing,
  onToggle,
  visible = true,
}: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -100, scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div
            onClick={onToggle}
            className="text-white rounded-full flex items-center cursor-pointer hover:scale-105 transition-transform w-auto max-w-sm gap-3"
            style={{
              background: "rgba(18, 8, 38, 0.88)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              minHeight: 44,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 10,
              paddingRight: 14,
            }}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
              <Image
                src="/images/kakak/bersama kak ripda.jpg"
                alt="Cover"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center min-w-[80px]">
              <span className="text-[10px] text-stone-200 font-medium leading-none mb-0.5 tracking-wider uppercase">
                Now Playing
              </span>
              <span className="text-xs font-bold leading-none truncate max-w-[150px]">
                buat kak ripdaa 🎵
              </span>
            </div>

            <div className="flex items-center gap-[3px] h-3 ml-2">
              {[1, 2, 3, 4, 3, 2].map((i, index) => (
                <motion.div
                  key={index}
                  animate={playing ? { height: [4, 14, 4] } : { height: 4 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="w-[3px] bg-[#c084fc] rounded-full"
                  style={{
                    background: "linear-gradient(to top, #f43f5e, #a78bfa)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
