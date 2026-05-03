export default function ElementalBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(27,138,191,0.12),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(32,199,138,0.10),transparent_26%),radial-gradient(circle_at_76%_78%,rgba(249,115,22,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_16%_18%,rgba(59,157,216,0.14),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(45,217,148,0.10),transparent_26%),radial-gradient(circle_at_76%_78%,rgba(251,128,57,0.08),transparent_30%)]" />
      <svg
        className="absolute left-1/2 top-0 h-full min-h-[900px] w-[1400px] -translate-x-1/2 text-primary/20 dark:text-primary/15"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 900"
      >
        <defs>
          <linearGradient id="lineage-thread" x1="215" x2="1185" y1="124" y2="770">
            <stop stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity="0.38" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="lineage-branch" x1="430" x2="1052" y1="234" y2="612">
            <stop stopColor="#20c78a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#f97316" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        <path
          d="M210 156C310 218 358 342 474 374C604 410 660 260 792 300C930 342 944 548 1088 604C1164 634 1242 608 1300 568"
          stroke="url(#lineage-thread)"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M382 320C476 310 514 214 610 188C710 160 772 196 846 258"
          stroke="url(#lineage-branch)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M602 390C664 486 742 548 862 548C946 548 1010 510 1058 454"
          stroke="url(#lineage-branch)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M748 302C804 398 846 452 942 470C1022 484 1112 452 1178 404"
          stroke="currentColor"
          strokeLinecap="round"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
        <path
          d="M334 586C444 516 542 512 636 590C736 672 848 710 1004 658"
          stroke="currentColor"
          strokeDasharray="5 12"
          strokeLinecap="round"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />

        {[
          [210, 156],
          [474, 374],
          [610, 188],
          [792, 300],
          [862, 548],
          [1088, 604],
          [1178, 404],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            fill="currentColor"
            fillOpacity="0.18"
            r="4"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/72 to-background dark:from-background/10 dark:via-background/68 dark:to-background" />
    </div>
  );
}
