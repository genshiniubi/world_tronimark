export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="presentation">
        <rect x="1" y="1" width="62" height="62" rx="15" fill="#fbfcf8" stroke="#d9dfd4" />
        <g transform="translate(32 32)">
          <path d="M0 -23 L10 -8 L-10 -8 Z" fill="#ffb4b4" />
          <path d="M0 -23 L10 -8 L-10 -8 Z" transform="rotate(120)" fill="#ffe08a" />
          <path d="M0 -23 L10 -8 L-10 -8 Z" transform="rotate(240)" fill="#a8caff" />
        </g>
        <path
          d="M25 41 31 26 M33 41 39 26"
          fill="none"
          stroke="#14181f"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
