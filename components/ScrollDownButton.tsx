"use client";

type Props = {
  targetId: string;
};

export default function ScrollDownButton({ targetId }: Props) {
  function handleClick() {
    const target = document.getElementById(targetId);
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.reduceMotion === "true";
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    if (target) {
      target.scrollIntoView({ behavior, block: "start" });
      window.history.replaceState(null, "", `#${targetId}`);
      return;
    }

    window.scrollBy({ top: window.innerHeight * 0.85, behavior });
  }

  return (
    <button
      type="button"
      aria-label="Scroll to more content"
      onClick={handleClick}
      className="absolute bottom-6 left-1/2 z-20 inline-flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/20"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
  );
}
