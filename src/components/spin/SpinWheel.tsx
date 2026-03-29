"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Gift, Share2, Check, Lock, ExternalLink, Trophy } from "lucide-react";
import { siteConfig } from "@/lib/config";

// ── Prize definitions ────────────────────────────────────────────────────────
export interface Prize {
  key: string;
  labelFr: string;
  labelEn: string;
  color: string;
  textColor: string;
  weight: number; // probability weight
  icon: string;
  claimType: "vip_trial" | "vip_discount" | "jackpot_tickets" | "guide" | "spin_again" | "affiliate_bonus";
}

export const PRIZES: Prize[] = [
  {
    key: "vip_week_free",
    labelFr: "1 Semaine VIP\nGRATUITE",
    labelEn: "1 Free Week\nVIP Access",
    color: "#FFD700",
    textColor: "#1a1a2e",
    weight: 5,
    icon: "👑",
    claimType: "vip_trial",
  },
  {
    key: "vip_50_off",
    labelFr: "50% de\nRéduction VIP",
    labelEn: "50% Off\nFirst Month",
    color: "#FF6B35",
    textColor: "#ffffff",
    weight: 15,
    icon: "🔥",
    claimType: "vip_discount",
  },
  {
    key: "jackpot_tickets",
    labelFr: "3 Tickets\nJackpot Gratuits",
    labelEn: "3 Free\nJackpot Tickets",
    color: "#10B981",
    textColor: "#ffffff",
    weight: 20,
    icon: "🎫",
    claimType: "jackpot_tickets",
  },
  {
    key: "betting_guide",
    labelFr: "Guide Pro\nParis Sportifs",
    labelEn: "Pro Betting\nGuide PDF",
    color: "#6366F1",
    textColor: "#ffffff",
    weight: 25,
    icon: "📘",
    claimType: "guide",
  },
  {
    key: "spin_again",
    labelFr: "Retente ta\nChance Demain",
    labelEn: "Try Again\nTomorrow",
    color: "#94A3B8",
    textColor: "#ffffff",
    weight: 20,
    icon: "🔄",
    claimType: "spin_again",
  },
  {
    key: "1xbet_bonus",
    labelFr: "Bonus 200%\n1xBet 130K FCFA",
    labelEn: "200% Bonus\n1xBet Up to $200",
    color: "#1E40AF",
    textColor: "#ffffff",
    weight: 15,
    icon: "💰",
    claimType: "affiliate_bonus",
  },
];

// ── Weighted random selection ────────────────────────────────────────────────
function pickPrize(): number {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].weight;
    if (random <= 0) return i;
  }
  return PRIZES.length - 1;
}

// ── Generate unique ref code ─────────────────────────────────────────────────
function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronofoot-backend-production.up.railway.app";

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
        // Check if spin has expired (7 days)
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

    // Check for daily spin reset
    const lastSpin = localStorage.getItem("pf_spin_date");
    const today = new Date().toDateString();
    if (lastSpin === today && !localStorage.getItem("pf_spin")) {
      // Already spun today, no stored data = spin_again result expired
    }
  }, []);

  // Save spin state to localStorage
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
    const interval = setInterval(poll, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [refCode, phase, saveSpin]);

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;
    const sliceAngle = (2 * Math.PI) / PRIZES.length;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    PRIZES.forEach((prize, i) => {
      const startAngle = i * sliceAngle + rotationRef.current;
      const endAngle = startAngle + sliceAngle;

      // Slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 13px Inter, system-ui, sans-serif";
      const label = isFr ? prize.labelFr : prize.labelEn;
      const lines = label.split("\n");
      lines.forEach((line, li) => {
        ctx.fillText(line, radius * 0.6, (li - (lines.length - 1) / 2) * 16);
      });
      // Icon
      ctx.font = "22px serif";
      ctx.fillText(prize.icon, radius * 0.3, 6);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPIN", center, center + 4);

    // Pointer (top)
    ctx.beginPath();
    ctx.moveTo(center - 12, 4);
    ctx.lineTo(center + 12, 4);
    ctx.lineTo(center, 28);
    ctx.closePath();
    ctx.fillStyle = "#EF4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [isFr, spinning, result]);

  // Spin animation
  const spin = useCallback(() => {
    if (spinning || phase !== "idle") return;

    // Check daily limit
    const lastSpin = localStorage.getItem("pf_spin_date");
    const today = new Date().toDateString();
    if (lastSpin === today) return;

    setSpinning(true);
    setPhase("spinning");

    const winIndex = pickPrize();
    const sliceAngle = (2 * Math.PI) / PRIZES.length;
    // Target: the winning slice should be at top (where pointer is)
    // Pointer is at top = angle 270° = -π/2
    // We need the center of the winning slice to align with -π/2
    const targetAngle = -sliceAngle * winIndex - sliceAngle / 2 - Math.PI / 2;
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = fullSpins * 2 * Math.PI + (targetAngle - rotationRef.current) % (2 * Math.PI);

    const startRotation = rotationRef.current;
    const duration = 4000 + Math.random() * 1000; // 4-5 seconds
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      rotationRef.current = startRotation + totalRotation * eased;

      // Redraw
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const size = canvas.width;
          const center = size / 2;
          const radius = center - 8;

          ctx.clearRect(0, 0, size, size);

          PRIZES.forEach((prize, i) => {
            const startAngle = i * sliceAngle + rotationRef.current;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "center";
            ctx.fillStyle = prize.textColor;
            ctx.font = "bold 13px Inter, system-ui, sans-serif";
            const label = isFr ? prize.labelFr : prize.labelEn;
            const lines = label.split("\n");
            lines.forEach((line, li) => {
              ctx.fillText(line, radius * 0.6, (li - (lines.length - 1) / 2) * 16);
            });
            ctx.font = "22px serif";
            ctx.fillText(prize.icon, radius * 0.3, 6);
            ctx.restore();
          });

          // Center
          ctx.beginPath();
          ctx.arc(center, center, 28, 0, 2 * Math.PI);
          ctx.fillStyle = "#1a1a2e";
          ctx.fill();
          ctx.strokeStyle = "#FFD700";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = "#FFD700";
          ctx.font = "bold 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("SPIN", center, center + 4);

          // Pointer
          ctx.beginPath();
          ctx.moveTo(center - 12, 4);
          ctx.lineTo(center + 12, 4);
          ctx.lineTo(center, 28);
          ctx.closePath();
          ctx.fillStyle = "#EF4444";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Done spinning
        setSpinning(false);
        setResult(winIndex);

        const prize = PRIZES[winIndex];
        if (prize.key === "spin_again") {
          setPhase("idle");
          localStorage.setItem("pf_spin_date", new Date().toDateString());
          // Brief flash showing "try again tomorrow"
          setTimeout(() => {
            setResult(null);
          }, 3000);
        } else {
          // Generate ref code and save to backend
          const code = generateRefCode();
          setRefCode(code);
          setPhase("reveal");
          localStorage.setItem("pf_spin_date", new Date().toDateString());

          // Create referral entry in backend
          fetch(`${BACKEND_URL}/api/spin/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ref_code: code,
              prize_key: prize.key,
              prize_label: isFr ? prize.labelFr.replace("\n", " ") : prize.labelEn.replace("\n", " "),
            }),
          }).catch(() => {});

          saveSpin({
            refCode: code,
            prizeIndex: winIndex,
            unlocked: false,
            clicks: 0,
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [spinning, phase, isFr, saveSpin]);

  // WhatsApp share
  const shareToWhatsApp = () => {
    const prize = result !== null ? PRIZES[result] : null;
    if (!prize) return;

    const prizeLabel = isFr
      ? prize.labelFr.replace("\n", " ")
      : prize.labelEn.replace("\n", " ");
    const shareUrl = `${siteConfig.url}/${locale}?ref=${refCode}`;
    const message = isFr
      ? `🎰 J'ai gagné "${prizeLabel}" sur PronoFoot AI !\n\n🏆 Tourne la roue toi aussi et gagne des prix : pronostics VIP gratuits, tickets jackpot, bonus 1xBet...\n\n👉 ${shareUrl}`
      : `🎰 I just won "${prizeLabel}" on PronoFoot AI!\n\n🏆 Spin the wheel and win prizes: free VIP access, jackpot tickets, 1xBet bonus...\n\n👉 ${shareUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setShareCount((prev) => {
      const newCount = prev + 1;
      saveSpin({ shareCount: newCount });
      return newCount;
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
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-[20%] left-[25%] w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700" />
        <div className="absolute top-[60%] right-[10%] w-2 h-2 bg-green-400 rounded-full animate-pulse delay-500" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Gift className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold tracking-wide">
              {isFr ? "TOURNE & GAGNE" : "SPIN & WIN"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {isFr
              ? "Tente ta Chance Aujourd'hui !"
              : "Try Your Luck Today!"}
          </h2>
          <p className="text-purple-200 text-lg max-w-xl mx-auto">
            {isFr
              ? "Tourne la roue, gagne un prix, et partage avec 5 amis pour le débloquer."
              : "Spin the wheel, win a prize, and share with 5 friends to unlock it."}
          </p>
        </div>

        {/* Wheel + Result Panel */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Wheel */}
          <div className="relative">
            <div className="relative w-[320px] h-[320px] md:w-[360px] md:h-[360px]">
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="w-full h-full cursor-pointer"
                onClick={spin}
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(139,92,246,0.3)] pointer-events-none" />
            </div>

            {phase === "idle" && !result && (
              <button
                onClick={spin}
                className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-transparent flex items-center justify-center z-10 group"
                aria-label="Spin the wheel"
              >
                <span className="sr-only">{isFr ? "Tourner la roue" : "Spin the wheel"}</span>
              </button>
            )}

            {/* Spin Again Tomorrow overlay */}
            {result !== null && PRIZES[result].key === "spin_again" && phase === "idle" && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-2">🔄</p>
                  <p className="text-white font-bold">
                    {isFr ? "Reviens demain !" : "Come back tomorrow!"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Result / Share Panel */}
          <div className="w-full max-w-sm">
            {/* Idle state */}
            {phase === "idle" && !result && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white text-xl font-bold mb-2">
                  {isFr ? "Des prix incroyables !" : "Amazing Prizes!"}
                </h3>
                <ul className="text-purple-200 text-sm space-y-2 text-left">
                  <li>👑 {isFr ? "1 semaine VIP gratuite" : "1 free VIP week"}</li>
                  <li>🔥 {isFr ? "50% de réduction VIP" : "50% off VIP"}</li>
                  <li>🎫 {isFr ? "3 tickets jackpot gratuits" : "3 free jackpot tickets"}</li>
                  <li>💰 {isFr ? "Bonus 200% 1xBet (130K FCFA)" : "200% 1xBet Bonus (up to $200)"}</li>
                </ul>
                <button
                  onClick={spin}
                  className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold px-8 py-4 rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all text-lg shadow-lg shadow-yellow-500/25 animate-pulse"
                >
                  🎰 {isFr ? "TOURNER LA ROUE" : "SPIN THE WHEEL"}
                </button>
              </div>
            )}

            {/* Spinning state */}
            {phase === "spinning" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="animate-bounce text-4xl mb-4">🎰</div>
                <p className="text-white text-xl font-bold">
                  {isFr ? "La roue tourne..." : "Spinning..."}
                </p>
              </div>
            )}

            {/* Reveal state */}
            {phase === "reveal" && prize && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="text-5xl mb-3">{prize.icon}</div>
                <h3 className="text-white text-2xl font-extrabold mb-2">
                  {isFr ? "Tu as gagné !" : "You Won!"}
                </h3>
                <p className="text-yellow-300 text-lg font-bold mb-4">{prizeLabel}</p>
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <Lock className="w-5 h-5 text-purple-300 mx-auto mb-2" />
                  <p className="text-purple-200 text-sm mb-1">
                    {isFr
                      ? "Partage avec 5 amis pour débloquer ton prix :"
                      : "Share with 5 friends to unlock your prize:"}
                  </p>
                  <p className="text-white text-xs">
                    {isFr
                      ? "Quand 5 personnes cliquent ton lien, le prix est débloqué !"
                      : "When 5 people click your link, the prize unlocks!"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPhase("sharing");
                    shareToWhatsApp();
                  }}
                  className="w-full bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20BD5A] transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  {isFr ? "Partager sur WhatsApp" : "Share on WhatsApp"}
                </button>
              </div>
            )}

            {/* Sharing state - progress tracker */}
            {phase === "sharing" && prize && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl">{prize.icon}</span>
                  <p className="text-yellow-300 font-bold mt-1">{prizeLabel}</p>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-200">
                      {isFr ? "Amis qui ont cliqué" : "Friends who clicked"}
                    </span>
                    <span className="text-white font-bold">
                      {clicks}/{clicksRequired}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((clicks / clicksRequired) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-purple-300 text-xs mt-1">
                    {clicks >= clicksRequired
                      ? (isFr ? "🎉 Prix débloqué !" : "🎉 Prize unlocked!")
                      : (isFr
                          ? `Encore ${clicksRequired - clicks} clic${clicksRequired - clicks > 1 ? "s" : ""} pour débloquer`
                          : `${clicksRequired - clicks} more click${clicksRequired - clicks > 1 ? "s" : ""} to unlock`)}
                  </p>
                </div>

                {/* Share buttons */}
                <button
                  onClick={shareToWhatsApp}
                  className="w-full bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20BD5A] transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <Share2 className="w-5 h-5" />
                  {isFr ? `Partager sur WhatsApp (${shareCount}x)` : `Share on WhatsApp (${shareCount}x)`}
                </button>

                {/* Copy link fallback */}
                <button
                  onClick={() => {
                    const url = `${siteConfig.url}/${locale}?ref=${refCode}`;
                    navigator.clipboard.writeText(url).catch(() => {});
                  }}
                  className="w-full bg-white/10 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
                >
                  {isFr ? "📋 Copier le lien" : "📋 Copy link"}
                </button>

                <p className="text-purple-300/60 text-xs text-center mt-3">
                  {isFr
                    ? "Le statut se met à jour automatiquement"
                    : "Status updates automatically"}
                </p>
              </div>
            )}

            {/* Unlocked state */}
            {phase === "unlocked" && prize && (
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-500/30">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-2xl font-extrabold mb-1">
                  {isFr ? "Prix Débloqué !" : "Prize Unlocked!"}
                </h3>
                <p className="text-yellow-300 text-lg font-bold mb-4">{prizeLabel}</p>
                <button
                  onClick={claimPrize}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold px-8 py-4 rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all text-lg shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  {isFr ? "Réclamer Mon Prix" : "Claim My Prize"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
