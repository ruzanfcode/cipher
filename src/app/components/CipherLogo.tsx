import React from "react";

export function CipherLogo({ height = 32 }: { height?: number }) {
  const w = (290 / 62) * height;
  return (
    <svg
      viewBox="0 0 290 62"
      width={w}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CIPHER"
      className="select-none shrink-0"
    >
      <text
        x="2" y="50"
        fontFamily="'Arial Black', 'Impact', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900" fontSize="52" letterSpacing="-2"
        fill="currentColor"
      >
        {"<IPHER>"}
      </text>
      <line x1="226" y1="31" x2="248" y2="31" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="248" y1="31" x2="272" y2="10" stroke="#F97316" strokeWidth="3"   strokeLinecap="round" />
      <circle cx="248" cy="31" r="9"   fill="#F97316" />
      <circle cx="272" cy="10" r="6.5" fill="#F97316" />
    </svg>
  );
}
