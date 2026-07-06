import React from "react";

export const BrandLogoSVG: Record<string, React.FC> = {
  Nike: () => (
    <svg viewBox="0 0 100 38" className="w-full h-full" fill="currentColor">
      <path d="M4,30 C18,8 46,0 70,6 C80,9 86,17 76,23 C64,30 22,36 4,30Z"/>
    </svg>
  ),
  Adidas: () => (
    <svg viewBox="0 0 44 40" className="w-full h-full" fill="currentColor">
      <rect x="2"  y="6" width="10" height="30" rx="2"/>
      <rect x="17" y="6" width="10" height="30" rx="2"/>
      <rect x="32" y="6" width="10" height="30" rx="2"/>
    </svg>
  ),
  "H&M": () => (
    <svg viewBox="0 0 64 34" className="w-full h-full" fill="currentColor">
      <text x="2" y="28" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="32">{"H&M"}</text>
    </svg>
  ),
  Zara: () => (
    <svg viewBox="0 0 84 26" className="w-full h-full" fill="currentColor">
      <text x="2" y="22" fontFamily="Georgia,Times New Roman,serif" fontWeight="700" fontSize="22" letterSpacing="6">ZARA</text>
    </svg>
  ),
  Uniqlo: () => (
    <svg viewBox="0 0 74 34" className="w-full h-full">
      <rect x="1" y="1" width="72" height="32" rx="5" fill="currentColor"/>
      <text x="7" y="24" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="15" fill="white" letterSpacing="0.5">UNIQLO</text>
    </svg>
  ),
  Gymshark: () => (
    <svg viewBox="0 0 40 40" className="w-full h-full" fill="currentColor">
      <path d="M20,4 C28,4 36,14 38,36 L24,36 C24,28 22,22 18,18 C14,22 12,28 12,36 L2,36 C4,14 12,4 20,4Z"/>
    </svg>
  ),
  Lululemon: () => (
    <svg viewBox="0 0 44 44" className="w-full h-full" fill="currentColor">
      <path d="M22,4 C10,4 2,12 2,22 C2,32 10,40 22,40 C34,40 42,32 42,22 C42,12 34,4 22,4Z M22,12 C30,12 34,17 34,22 C34,28 30,32 22,32 C14,32 10,28 10,22 C10,17 14,12 22,12Z M12,34 L6,42 M32,34 L38,42"/>
      <line x1="6"  y1="42" x2="12" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="34" x2="38" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Champion: () => (
    <svg viewBox="0 0 44 44" className="w-full h-full" fill="currentColor">
      <path d="M38,14 C30,4 14,4 8,14 C4,20 4,26 8,32 C14,42 30,42 38,32 L32,27 C27,33 17,33 13,27 C10,23 10,21 13,17 C17,11 27,11 32,17Z"/>
      <rect x="4" y="19" width="14" height="6" rx="2"/>
    </svg>
  ),
  Carhartt: () => (
    <svg viewBox="0 0 90 28" className="w-full h-full" fill="currentColor">
      <text x="0" y="22" fontFamily="Arial Black,Impact,sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">CARHARTT</text>
    </svg>
  ),
  Patagonia: () => (
    <svg viewBox="0 0 50 42" className="w-full h-full" fill="currentColor">
      <path d="M25,4 L46,38 L4,38Z"/>
      <path d="M14,22 L25,4 L36,22Z" fill="white" opacity="0.5"/>
    </svg>
  ),
};
