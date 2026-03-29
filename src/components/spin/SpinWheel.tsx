"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Share2, Check, Lock, ExternalLink, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";

// ── Prize definitions ────────────────────────────────────────────────────────
export interface Prize {
  key: string;
  labelFr: string;
  labelEn: string;
  color: string;
  gradient: [string, string];
  textColor: string;
  weight: number;
  icon: string;
  claimType: "vip_trial" | "vip_discount" | "jackpot_tickets" | "guide" | "spin_again" | "affiliate_bonus";
  instantUnlock?: boolean;
}

export const PRIZES: Prize[] = [
  {
    key: "vip_week_free",
    labelFr: "1 Semaine VIP\nGRATUITE",
    labelEn: "1 Free Week\nVIP Access",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#D97706"],
    textColor: "#1a1a2e",
    weight: 5,
    icon: "👑",
    claimType: "vip_trial",
  },
  {
    key: "vip_50_off",
    labelFr: "50% de\nRéduction VIP",
    labelEn: "50% Off\nVIP Access",
    color: "#EF4444",
    gradient: ["#EF4444", "#DC2626"],
    textColor: "#ffffff",
    weight: 15,
    icon: "🔥",
    claimType: "vip_discount",
  },
  {
    key: "jackpot_tickets",
    labelFr: "3 Tickets\nJackpot",
    labelEn: "3 Jackpot\nTickets",
    color: "#10B981",
    gradient: ["#10B981", "#059669"],
    textColor: "#ffffff",
    weight: 20,
    icon: "🎫",
    claimType: "jackpot_tickets",
  },
  {
    key: "betting_guide",
    labelFr: "Guide Pro\nParis Sportifs",
    labelEn: "Pro Betting\nGuide",
    color: "#8B5CF6",
    gradient: ["#8B5CF6", "#7C3AED"],
    textColor: "#ffffff",
    weight: 25,
    icon: "📘",
    claimType: "guide",
  },
  {
    key: "spin_again",
    labelFr: "Retente\nDemain",
    labelEn: "Try Again\nTomorrow",
    color: "#64748B",
    gradient: ["#64748B", "#475569"],
    textColor: "#ffffff",
    weight: 20,
    icon: "🔄",
    claimType: "spin_again",
  },
  {
    key: "1xbet_bonus",
    labelFr: "Bonus 200%\n1xBet 130K",
    labelEn: "200% Bonus\n1xBet $200",
    color: "#2563EB",
    gradient: ["#3B82F6", "#1D4ED8"],
    textColor: "#ffffff",
    weight: 15,
    icon: "💰",
    claimType: "affiliate_bonus",
    instantUnlock: true,
  },
];

// ── Weighted random ──────────────────────────────────────────────────────────
function pickPrize(): number {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].weight;
    if (random <= 0) return i;
  }
  return PRIZES.length - 1;
}

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronofoot-backend-production.up.railway.app";

// ── Draw helpers ─────────────────────────────────────────────────────────────
function drawWheel(
  ctx: CanvasRenderingContext2D,
  size: number,
  rotation: number,
  isFr: boolean,
  highlightIndex: number | null
) {
  const center = size / 2;
  const radius = center - 16;
  const sliceAngle = (2 * Math.PI) / PRIZES.length;

  ctx.clearRect(0, 0, size, size);

  // Outer glow ring
  const glowGrad = ctx.createRadialGradient(center, center, radius - 4, center, center, radius + 14);
  glowGrad.addColorStop(0, "rgba(251, 191, 36, 0.0)");
  glowGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.15)");
  glowGrad.addColorStop(1, "rgba(251, 191, 36, 0.0)");
  ctx.beginPath();
  ctx.arc(center, center, radius + 14, 0, 2 * Math.PI);
  ctx.fillStyle = glowGrad;
  ctx.fill();

  // Outer decorative ring with notches
  ctx.beginPath();
  ctx.arc(center, center, radius + 6, 0, 2 * Math.PI);
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Gold dots around the outer ring
  const dotCount = 36;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * 2 * Math.PI;
    const dotR = radius + 6;
    const x = center + Math.cos(angle) * dotR;
    const y = center + Math.sin(angle) * dotR;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = i % 3 === 0 ? "#FDE68A" : "#B45309";
    ctx.fill();
  }

  // Draw slices
  PRIZES.forEach((prize, i) => {
    const startAngle = i * sliceAngle + rotation;
    const endAngle = startAngle + sliceAngle;

    // Create gradient for each slice
    const midAngle = startAngle + sliceAngle / 2;
    const gx = center + Math.cos(midAngle) * radius * 0.5;
    const gy = center + Math.sin(midAngle) * radius * 0.5;
    const grad = ctx.createRadialGradient(center, center, 30, gx, gy, radius);
    grad.addColorStop(0, prize.gradient[0]);
    grad.addColorStop(1, prize.gradient[1]);

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Bright inner border between slices
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Highlight winning slice
    if (highlightIndex === i) {
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fill();
    }

    // Text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(midAngle);
    ctx.textAlign = "center";
    ctx.fillStyle = prize.textColor;

    // Shadow for readability
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.font = "bold 12px 'Inter', system-ui, sans-serif";
    const label = isFr ? prize.labelFr : prize.labelEn;
    const lines = label.split("\n");
    lines.forEach((line, li) => {
      ctx.fillText(line, radius * 0.62, (li - (lines.length - 1) / 2) * 15);
    });

    // Icon
    ctx.shadowBlur = 0;
    ctx.font = "20px serif";
    ctx.fillText(prize.icon, radius * 0.32, 6);
    ctx.restore();
  });

  // Outer ring border
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center hub — layered for depth
  // Outer ring of center
  ctx.beginPath();
  ctx.arc(center, center, 36, 0, 2 * Math.PI);
  const hubOuterGrad = ctx.createRadialGradient(center, center, 20, center, center, 36);
  hubOuterGrad.addColorStop(0, "#F59E0B");
  hubOuterGrad.addColorStop(1, "#B45309");
  ctx.fillStyle = hubOuterGrad;
  ctx.fill();

  // Inner circle of center
  ctx.beginPath();
  ctx.arc(center, center, 28, 0, 2 * Math.PI);
  const hubGrad = ctx.createRadialGradient(center - 4, center - 4, 4, center, center, 28);
  hubGrad.addColorStop(0, "#1e1b4b");
  hubGrad.addColorStop(1, "#0f0a2e");
  ctx.fillStyle = hubGrad;
  ctx.fill();

  // Center ring glow
  ctx.beginPath();
  ctx.arc(center, center, 28, 0, 2 * Math.PI);
  ctx.strokeStyle = "#FBBF24";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center text
  ctx.fillStyle = "#FBBF24";
  ctx.font = "bold 13px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(251,191,36,0.6)";
  ctx.shadowBlur = 8;
  ctx.fillText("SPIN", center, center + 5);
  ctx.shadowBlur = 0;

  // Pointer — premium triangle at top
  const pW = 16;
  const pH = 30;
  ctx.beginPath();
  ctx.moveTo(center - pW, 10);
  ctx.lineTo(center + pW, 10);
  ctx.lineTo(center, 10 + pH);
  ctx.closePath();
  const pointerGrad = ctx.createLinearGradient(center, 10, center, 10 + pH);
  pointerGrad.addColorStop(0, "#FBBF24");
  pointerGrad.addColorStop(1, "#F59E0B");
  ctx.fillStyle = pointerGrad;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pointer shadow
  ctx.beginPath();
  ctx.moveTo(center - pW + 3, 10);
  ctx.lineTo(center, 10 + pH - 4);
  ctx.lineTo(center + pW - 3, 10);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
}

// ── Main component ───────────────────────────────────────────────────────────
export default function SpinWheel({ locale }: { locale: string }) {
  const isFr = locale === "fr";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "spinning" | "reveal" | "sharing" | "unlocked">("idle");
  const [refCode, setRefCode] = useState<string>("");
  const [clicks, setClicks] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const clicksRequired = 5;
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Check localStorage for existing spin
  useEffect(() => {
    const stored = localStorage.getItem("pf_spin");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        if (data.expires && now > data.expires) {
          localStorage.removeItem("pf_spin");
          return;
        }
        if (data.refCode) setRefCode(data.refCode);
        if (data.prizeIndex !== undefined) setResult(data.prizeIndex);
        if (data.unlocked) setPhase("unlocked");
        else if (data.prizeIndex !== undefined) setPhase("sharing");
        if (data.clicks) setClicks(data.clicks);
        if (data.shareCount) setShareCount(data.shareCount);
      } catch {}
    }
  }, []);

  const saveSpin = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const existing = JSON.parse(localStorage.getItem("pf_spin") || "{}");
      const data = {
        ...existing,
        refCode: refCode || existing.refCode,
        prizeIndex: result ?? existing.prizeIndex,
        expires: existing.expires || Date.now() + 7 * 24 * 60 * 60 * 1000,
        ...overrides,
      };
      localStorage.setItem("pf_spin", JSON.stringify(data));
    },
    [refCode, result]
  );

  // Poll referral status
  useEffect(() => {
    if (!refCode || phase === "unlocked" || phase === "idle") return;
    const poll = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/spin/status/${refCode}`);
        if (res.ok) {
          const data = await res.json();
          setClicks(data.unique_clicks || 0);
          if (data.prize_unlocked) {
            setPhase("unlocked");
            saveSpin({ unlocked: true, clicks: data.unique_clicks });
          } else {
            saveSpin({ clicks: data.unique_clicks });
          }
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [refCode, phase, saveSpin]);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawWheel(ctx, canvas.width, rotationRef.current, isFr, result);
  }, [isFr, spinning, result]);

  // Spin animation
  const spin = useCallback(() => {
    if (spinning || phase !== "idle") return;
    const lastSpin = localStorage.getItem("pf_spin_date");
    const today = new Date().toDateString();
    if (lastSpin === today) return;

    setSpinning(true);
    setPhase("spinning");

    const winIndex = pickPrize();
    const sliceAngle = (2 * Math.PI) / PRIZES.length;
    const targetAngle = -sliceAngle * winIndex - sliceAngle / 2 - Math.PI / 2;
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const totalRotation = fullSpins * 2 * Math.PI + (targetAngle - rotationRef.current) % (2 * Math.PI);

    const startRotation = rotationRef.current;
    const duration = 4500 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quartic ease-out for dramatic slow-down
      const eased = 1 - Math.pow(1 - progress, 4);
      rotationRef.current = startRotation + totalRotation * eased;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawWheel(ctx, canvas.width, rotationRef.current, isFr, null);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setResult(winIndex);

        // Redraw with highlight
        const canvas2 = canvasRef.current;
        if (canvas2) {
          const ctx2 = canvas2.getContext("2d");
          if (ctx2) drawWheel(ctx2, canvas2.width, rotationRef.current, isFr, winIndex);
        }

        const prize = PRIZES[winIndex];
        localStorage.setItem("pf_spin_date", new Date().toDateString());

        if (prize.key === "spin_again") {
          setPhase("idle");
          setTimeout(() => setResult(null), 3000);
          return;
        }

        // 1xBet bonus = instant unlock, no sharing required
        if (prize.instantUnlock) {
          setPhase("unlocked");
          saveSpin({ prizeIndex: winIndex, unlocked: true });
          return;
        }

        // All other prizes require sharing
        const code = generateRefCode();
        setRefCode(code);
        setPhase("reveal");

        fetch(`${BACKEND_URL}/api/spin/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ref_code: code,
            prize_key: prize.key,
            prize_label: isFr ? prize.labelFr.replace("\n", " ") : prize.labelEn.replace("\n", " "),
          }),
        }).catch(() => {});

        saveSpin({ refCode: code, prizeIndex: winIndex, unlocked: false, clicks: 0 });
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [spinning, phase, isFr, saveSpin]);

  // WhatsApp share
  const shareToWhatsApp = () => {
    const prize = result !== null ? PRIZES[result] : null;
    if (!prize) return;
    const prizeLabel = isFr ? prize.labelFr.replace("\n", " ") : prize.labelEn.replace("\n", " ");
    const shareUrl = `${siteConfig.url}/${locale}?ref=${refCode}`;
    const message = isFr
      ? `🎰 J'ai gagné "${prizeLabel}" sur PronoFoot AI !\n\n🏆 Tourne la roue et gagne : VIP gratuit, tickets jackpot, bonus 1xBet...\n\n👉 ${shareUrl}`
      : `🎰 I won "${prizeLabel}" on PronoFoot AI!\n\n🏆 Spin the wheel & win: free VIP, jackpot tickets, 1xBet bonus...\n\n👉 ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    setShareCount((prev) => {
      const c = prev + 1;
      saveSpin({ shareCount: c });
      return c;
    });
  };

  // Claim prize
  const claimPrize = () => {
    const prize = result !== null ? PRIZES[result] : null;
    if (!prize) return;
    switch (prize.claimType) {
      case "vip_trial":
      case "vip_discount":
        window.location.href = `/${locale}/vip?promo=${prize.key}`;
        break;
      case "jackpot_tickets":
        window.location.href = `/${locale}/tickets?bonus=${prize.key}`;
        break;
      case "affiliate_bonus":
        window.open(siteConfig.affiliateLink, "_blank");
        break;
      case "guide":
        window.location.href = `/${locale}/blog`;
        break;
    }
  };

  const prize = result !== null ? PRIZES[result] : null;
  const prizeLabel = prize ? (isFr ? prize.labelFr.replace("\n", " ") : prize.labelEn.replace("\n", " ")) : "";

  return (
    <section className="relative overflow-hidden">
      {/* Background — rich dark gradient with texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e1b4b_0%,#0f0a2e_50%,#030014_100%)]" />

      {/* Animated ambient lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          "top-[8%] left-[12%]",
          "top-[22%] right-[18%]",
          "bottom-[15%] left-[22%]",
          "top-[55%] right-[8%]",
          "top-[12%] right-[35%]",
          "bottom-[25%] right-[30%]",
          "top-[40%] left-[5%]",
          "bottom-[10%] left-[45%]",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-1 h-1 bg-amber-300 rounded-full`}
            style={{
              animation: `pulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.4 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md border border-amber-500/30 rounded-full px-5 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-bold tracking-widest uppercase">
              {isFr ? "Tourne & Gagne" : "Spin & Win"}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            {isFr ? "Tente ta Chance" : "Try Your Luck"}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              {" "}{isFr ? "Aujourd'hui" : "Today"}
            </span>
          </h2>
          <p className="text-indigo-200/80 text-lg max-w-lg mx-auto">
            {isFr
              ? "Tourne la roue et décroche des récompenses exclusives."
              : "Spin the wheel and win exclusive rewards."}
          </p>
        </div>

        {/* Wheel + Panel */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          {/* Wheel container */}
          <div className="relative flex-shrink-0">
            {/* Outer glow behind wheel */}
            <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-blue-500/20 blur-2xl pointer-events-none" />

            <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px]">
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="w-full h-full cursor-pointer drop-shadow-[0_0_40px_rgba(251,191,36,0.2)]"
                onClick={spin}
              />
            </div>

            {phase === "idle" && !result && (
              <button
                onClick={spin}
                className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-transparent z-10"
                aria-label={isFr ? "Tourner la roue" : "Spin the wheel"}
              />
            )}

            {/* Spin again overlay */}
            {result !== null && PRIZES[result].key === "spin_again" && phase === "idle" && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-3xl mb-2">🔄</p>
                  <p className="text-white font-bold text-lg">
                    {isFr ? "Reviens demain !" : "Come back tomorrow!"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-full max-w-sm">
            {/* ── IDLE ── */}
            {phase === "idle" && !result && (
              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl p-7 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-purple-500/5 pointer-events-none" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-white text-xl font-bold text-center mb-5">
                    {isFr ? "Des prix exclusifs !" : "Exclusive Prizes!"}
                  </h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: "👑", text: isFr ? "1 semaine VIP gratuite" : "1 free VIP week", accent: "text-amber-400" },
                      { icon: "🔥", text: isFr ? "50% de réduction VIP" : "50% off VIP", accent: "text-red-400" },
                      { icon: "🎫", text: isFr ? "3 tickets jackpot" : "3 jackpot tickets", accent: "text-emerald-400" },
                      { icon: "💰", text: isFr ? "Bonus 200% 1xBet (130K FCFA)" : "200% 1xBet Bonus ($200)", accent: "text-blue-400" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/5">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`text-sm font-medium ${item.accent}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={spin}
                    className="w-full relative group bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-[length:200%_auto] text-black font-black px-8 py-4 rounded-2xl text-lg shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] transition-all duration-300 hover:bg-right"
                  >
                    <span className="flex items-center justify-center gap-2">
                      🎰 {isFr ? "TOURNER LA ROUE" : "SPIN THE WHEEL"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ── SPINNING ── */}
            {phase === "spinning" && (
              <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center shadow-2xl">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">🎰</span>
                </div>
                <p className="text-white text-xl font-bold">
                  {isFr ? "La roue tourne..." : "Spinning..."}
                </p>
                <p className="text-indigo-300/60 text-sm mt-1">
                  {isFr ? "Bonne chance !" : "Good luck!"}
                </p>
              </div>
            )}

            {/* ── REVEAL (non-instant prizes) ── */}
            {phase === "reveal" && prize && (
              <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-7 border border-white/10 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-5xl mb-3">{prize.icon}</div>
                <h3 className="text-white text-2xl font-black mb-1">
                  {isFr ? "Tu as gagné !" : "You Won!"}
                </h3>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 text-lg font-bold mb-5">
                  {prizeLabel}
                </p>
                <div className="bg-white/[0.05] rounded-2xl p-4 mb-5 border border-white/10">
                  <Lock className="w-5 h-5 text-indigo-300 mx-auto mb-2" />
                  <p className="text-indigo-200 text-sm">
                    {isFr
                      ? "Partage avec 5 amis pour débloquer :"
                      : "Share with 5 friends to unlock:"}
                  </p>
                  <p className="text-indigo-300/60 text-xs mt-1">
                    {isFr
                      ? "Quand 5 personnes cliquent ton lien, c'est débloqué !"
                      : "When 5 people click your link, it unlocks!"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPhase("sharing");
                    shareToWhatsApp();
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25"
                >
                  <Share2 className="w-5 h-5" />
                  {isFr ? "Partager sur WhatsApp" : "Share on WhatsApp"}
                </button>
              </div>
            )}

            {/* ── SHARING — progress tracker ── */}
            {phase === "sharing" && prize && (
              <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-7 border border-white/10 shadow-2xl">
                <div className="text-center mb-5">
                  <span className="text-4xl">{prize.icon}</span>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-bold mt-2 text-lg">
                    {prizeLabel}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-indigo-200/80">
                      {isFr ? "Amis qui ont cliqué" : "Friends who clicked"}
                    </span>
                    <span className="text-white font-bold">{clicks}/{clicksRequired}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      style={{ width: `${Math.min((clicks / clicksRequired) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-indigo-300/60 text-xs mt-2">
                    {clicks >= clicksRequired
                      ? (isFr ? "🎉 Prix débloqué !" : "🎉 Prize unlocked!")
                      : (isFr
                          ? `Encore ${clicksRequired - clicks} clic${clicksRequired - clicks > 1 ? "s" : ""}`
                          : `${clicksRequired - clicks} more click${clicksRequired - clicks > 1 ? "s" : ""} to go`)}
                  </p>
                </div>

                <button
                  onClick={shareToWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mb-3 shadow-lg shadow-[#25D366]/25"
                >
                  <Share2 className="w-5 h-5" />
                  {isFr ? `Partager (${shareCount}x)` : `Share (${shareCount}x)`}
                </button>

                <button
                  onClick={() => {
                    const url = `${siteConfig.url}/${locale}?ref=${refCode}`;
                    navigator.clipboard.writeText(url).catch(() => {});
                  }}
                  className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium px-6 py-2.5 rounded-2xl transition-all text-sm border border-white/10"
                >
                  {isFr ? "📋 Copier le lien" : "📋 Copy link"}
                </button>

                <p className="text-indigo-300/40 text-xs text-center mt-4">
                  {isFr ? "Mise à jour automatique" : "Updates automatically"}
                </p>
              </div>
            )}

            {/* ── UNLOCKED ── */}
            {phase === "unlocked" && prize && (
              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl p-7 border border-emerald-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 pointer-events-none" />
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                    <Check className="w-9 h-9 text-white" strokeWidth={3} />
                  </div>
                  <h3 className="text-white text-2xl font-black mb-1">
                    {isFr ? "Prix Débloqué !" : "Prize Unlocked!"}
                  </h3>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 text-lg font-bold mb-5">
                    {prizeLabel}
                  </p>

                  {/* Special messaging for 1xBet bonus */}
                  {prize.claimType === "affiliate_bonus" && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-5">
                      <p className="text-blue-300 text-sm font-medium">
                        {isFr
                          ? "🎁 Crée ton compte 1xBet et reçois jusqu'à 130 000 FCFA de bonus !"
                          : "🎁 Create your 1xBet account and get up to $200 welcome bonus!"}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={claimPrize}
                    className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-[length:200%_auto] text-black font-black px-8 py-4 rounded-2xl text-lg shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] transition-all duration-300 hover:bg-right flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {prize.claimType === "affiliate_bonus"
                      ? (isFr ? "Ouvrir 1xBet" : "Open 1xBet")
                      : (isFr ? "Réclamer Mon Prix" : "Claim My Prize")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
