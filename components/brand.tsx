import Link from "next/link";
import Image from "next/image";

export function Brand({ size = 22 }: { size?: number }) {
  return (
    <Link
      href="/"
      aria-label="DocHouse"
      className="inline-flex items-center gap-2.5 text-ink hover:opacity-80 transition-opacity duration-300"
    >
      <Image
        src="/logo-dark.png"
        alt=""
        width={size}
        height={size}
        priority
        style={{ width: size, height: size, display: "block" }}
      />
      <span
        className="font-display tracking-tight"
        style={{
          fontSize: Math.round(size * 0.82),
          fontFeatureSettings: '"ss01"',
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        DocHouse
      </span>
    </Link>
  );
}
