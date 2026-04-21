"use client";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  onPlay: (e: React.MouseEvent) => void;
  albumSrc: string;
  title: string;
  subtitle: string;
};

export default function MusicCard({
  onPlay,
  albumSrc,
  title,
  subtitle,
}: Props) {
  return (
    <div
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        width: "100%",
        background: "rgba(14,8,28,0.80)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Album art */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
        <Image
          src={albumSrc}
          alt="album"
          fill
          priority
          className="object-cover"
          sizes="360px"
        />
        {/* Gradient overlay fading into card body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 45%, rgba(14,8,28,0.98) 100%)",
          }}
        />
      </div>

      {/* Card body — 100% inline styles so Tailwind can't interfere */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px 22px 22px",
          gap: "16px",
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <p
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {title}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "12px",
                margin: 0,
                textAlign: "left",
              }}
            >
              {subtitle}
            </p>
          </div>
          <span style={{ fontSize: "22px", marginTop: "2px" }}>💜</span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            borderRadius: "99px",
            background: "rgba(255,255,255,0.12)",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              borderRadius: "99px",
              background: "linear-gradient(90deg, #c084fc, #818cf8)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "32%" }}
            transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
          />
        </div>

        {/* Play button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.button
            onClick={onPlay}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #c084fc, #818cf8)",
              boxShadow: "0 8px 28px rgba(192,132,252,0.45)",
            }}
            animate={{
              boxShadow: [
                "0 8px 28px rgba(192,132,252,0.3)",
                "0 8px 44px rgba(192,132,252,0.65)",
                "0 8px 28px rgba(192,132,252,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        </div>

        {/* Hint */}
        <motion.p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.35)",
            fontSize: "12px",
            margin: 0,
          }}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Lagunya klik dlu yaa kak 👆
        </motion.p>
      </div>
    </div>
  );
}
