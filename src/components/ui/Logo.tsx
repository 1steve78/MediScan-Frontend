import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export default function Logo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Center top detailing/joint */}
      <path d="M 50 25 L 50 31" strokeWidth="5" />
      
      {/* Left Lobe (Top) */}
      <path d="M 47 31 C 41 16, 20 16, 20 38 C 20 44, 22 49, 25 53" />
      
      {/* Right Lobe (Top) */}
      <path d="M 53 31 C 59 16, 80 16, 80 38 C 80 44, 78 49, 75 53" />
      
      {/* Bottom Left Curved V */}
      <path d="M 28 60 C 33 66, 43 72, 50 78" />
      
      {/* Bottom Right Curved V */}
      <path d="M 72 60 C 67 66, 57 72, 50 78" />
      
      {/* Stethoscope tubing stem and loop */}
      <path d="M 50 78 L 50 82 C 50 92, 38 94, 30 88 C 22 82, 22 72, 30 66" />
      
      {/* Chestpiece (Diaphragm) at the end of the tubing loop */}
      <circle cx="30" cy="66" r="5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="66" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
