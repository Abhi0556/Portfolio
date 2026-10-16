// components/ui/LogoMark.tsx
import { forwardRef } from "react";

interface LogoMarkProps {
  className?: string;
  style?: React.CSSProperties;
  fillColor?: string;
}

export const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(
  function LogoMark({ className, style, fillColor = "var(--color-accent-primary)" }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 332 319"
        className={className}
        fill={fillColor}
        aria-hidden="true"
        style={style}
      >
        <path
          d="M 165.5 4 L 168 5.5 L 242 151 L 196 166 L 165.5 106 L 109 214.5 L 110.5 215 L 265 159 L 261.5 164 L 250 171 L 247.5 173 L 202 204 L 200.5 206 Q 121.4 259.2 32 301 L 31.5 303 L 29.5 303 L 25.5 305 L 16 309 L 15.5 311 L 13.5 311 L 5.5 314 L 5.5 311 L 7 310.5 L 6.5 309 L 8 306.5 L 165.5 4 Z"
        />
        <path
          d="M 258.5 186 L 262 187.5 L 327 314 L 255 279.5 L 221 211.5 L 258.5 186 Z"
        />
      </svg>
    );
  }
);