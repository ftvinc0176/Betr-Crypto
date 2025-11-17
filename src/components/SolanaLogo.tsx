// Solana logo SVG for professional display
export default function SolanaLogo({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#000"/>
      <g>
        <linearGradient id="solana-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <path d="M10 14.5C10 14.2239 10.2239 14 10.5 14H29.5C29.7761 14 30 14.2239 30 14.5V16.5C30 16.7761 29.7761 17 29.5 17H10.5C10.2239 17 10 16.7761 10 16.5V14.5Z" fill="url(#solana-gradient)"/>
        <path d="M10 19.5C10 19.2239 10.2239 19 10.5 19H29.5C29.7761 19 30 19.2239 30 19.5V21.5C30 21.7761 29.7761 22 29.5 22H10.5C10.2239 22 10 21.7761 10 21.5V19.5Z" fill="url(#solana-gradient)"/>
        <path d="M10 24.5C10 24.2239 10.2239 24 10.5 24H29.5C29.7761 24 30 24.2239 30 24.5V26.5C30 26.7761 29.7761 27 29.5 27H10.5C10.2239 27 10 26.7761 10 26.5V24.5Z" fill="url(#solana-gradient)"/>
      </g>
    </svg>
  );
}
