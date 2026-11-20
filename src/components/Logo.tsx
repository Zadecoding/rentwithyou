'use client';

import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'icon';
  className?: string;
  height?: number;
  size?: 'sm' | 'md' | 'lg' | number;
}

export default function Logo({
  variant = 'dark',
  className = '',
  height,
  size,
}: LogoProps) {
  const resolvedHeight = typeof size === 'number'
    ? size
    : size === 'sm'
    ? 32
    : size === 'md'
    ? 48
    : size === 'lg'
    ? 64
    : (height ?? 44);

  const isLight = variant === 'light';
  const strokeColor = isLight ? '#FFFFFF' : '#1B2A4A';
  const textColor = isLight ? '#FFFFFF' : '#1B2A4A';
  const subtitleColor = isLight ? '#CBD5E1' : '#5C6672';
  const accentGold = isLight ? '#E59A38' : '#BA854D';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 160 160"
        height={resolvedHeight}
        className={className}
        style={{ height: resolvedHeight, width: 'auto' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke={strokeColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 20 84 L 80 28 L 140 84" />
          <path d="M 33 72 L 33 136 L 127 136 L 127 72" />
          <path d="M 65 136 L 65 96 L 95 96 L 95 136" />
          <rect x="45" y="86" width="13" height="13" fill={accentGold} stroke="none" />
          <rect x="102" y="86" width="13" height="13" fill={accentGold} stroke="none" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 540 148"
      height={resolvedHeight}
      className={className}
      style={{ height: resolvedHeight, width: 'auto' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House Icon Mark */}
      <g stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Roof */}
        <path d="M 22 76 L 80 22 L 138 76" />
        {/* Walls & floor */}
        <path d="M 34 64 L 34 126 L 126 126 L 126 64" />
        {/* Door */}
        <path d="M 65 126 L 65 88 L 95 88 L 95 126" />
        {/* Left Window */}
        <rect x="46" y="78" width="12" height="12" fill={accentGold} stroke="none" />
        {/* Right Window */}
        <rect x="102" y="78" width="12" height="12" fill={accentGold} stroke="none" />
      </g>

      {/* Main Title: Rent With You */}
      <text
        x="166"
        y="72"
        fill={textColor}
        fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="700"
        letterSpacing="-0.3"
      >
        Rent With You
      </text>

      {/* Gold Divider Line */}
      <line
        x1="166"
        y1="90"
        x2="480"
        y2="90"
        stroke={accentGold}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Tagline: A HOME, WITH YOU */}
      <text
        x="168"
        y="114"
        fill={subtitleColor}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="12"
        fontWeight="600"
        letterSpacing="0.36em"
      >
        A HOME, WITH YOU
      </text>
    </svg>
  );
}
