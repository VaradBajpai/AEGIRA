function AegiraLogo({ compact = false }) {
  return (
    <div className={`aegira-logo ${compact ? "compact" : ""}`}>
      <div className="aegira-logo-mark">
        <svg
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="aegiraShield"
              x1="8"
              y1="6"
              x2="56"
              y2="58"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A684E8" />
              <stop offset="0.5" stopColor="#7254B8" />
              <stop offset="1" stopColor="#3E2D69" />
            </linearGradient>

            <linearGradient
              id="aegiraGlow"
              x1="20"
              y1="12"
              x2="48"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="1" stopColor="#E9DFFF" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          <path
            d="M32 4L54 12V29C54 43 45.3 54.1 32 60C18.7 54.1 10 43 10 29V12L32 4Z"
            fill="url(#aegiraShield)"
          />

          <path
            d="M32 9L49 15.1V29C49 39.7 42.7 48.7 32 54C21.3 48.7 15 39.7 15 29V15.1L32 9Z"
            fill="none"
            stroke="white"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />

          <path
            d="M23 43L31.2 20H34.3L42.4 43H37.8L36 37.5H29.2L27.4 43H23ZM30.5 33.7H34.8L32.7 27.1L30.5 33.7Z"
            fill="url(#aegiraGlow)"
          />

          <circle
            cx="47"
            cy="16"
            r="4.2"
            fill="#F7C7DD"
          />

          <path
            d="M47 10.5V21.5M41.5 16H52.5"
            stroke="white"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!compact && (
        <div className="aegira-logo-text">
          <span className="aegira-wordmark">
            AEGIRA
          </span>

          <span className="aegira-tagline">
            Safety • Support • Privacy
          </span>
        </div>
      )}
    </div>
  );
}

export default AegiraLogo;