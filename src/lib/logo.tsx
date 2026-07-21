import React from "react";

export function Logo(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Paperless"
      {...props}
    >
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="95"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
      />

      <path
        d="M38 30 C38 20 46 14 56 14 C66 14 74 20 74 30 L74 62 C74 70 68 76 60 76 C54 76 50 72 50 66 L50 38"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default Logo;