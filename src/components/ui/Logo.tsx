import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
};

export default function Logo({
  size = 32,
  className = "",
  showText = true,
  variant = "dark",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo.svg"
        alt="PronoFoot AI"
        width={size}
        height={size}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span
          className={`font-bold text-xl ${
            variant === "dark" ? "text-gray-900" : "text-white"
          }`}
        >
          Prono
          <span
            className={
              variant === "dark" ? "text-sky-700" : "text-sky-400"
            }
          >
            Foot
          </span>{" "}
          <span
            className={`text-sm font-semibold ${
              variant === "dark" ? "text-sky-600" : "text-sky-300"
            }`}
          >
            AI
          </span>
        </span>
      )}
    </span>
  );
}
