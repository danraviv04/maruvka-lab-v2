'use client';

import { useEffect, useRef } from 'react';

type HelixCanvasProps = {
  className?: string;
  /** When false, one static frame is drawn and no loop starts. */
  animate?: boolean;
};

const STRAND_A = '#3b9dd8'; // --color-primary, dark-mode value
const STRAND_B = '#2dd994'; // --color-secondary, dark-mode value

/**
 * A slowly rotating DNA double helix, drawn on a canvas as the hero backdrop.
 *
 * This is the stand-in until a real lab video exists: a few KB of code rather
 * than a multi-megabyte file, and it never blocks first paint. HeroStage lays
 * a video over it the moment one is available.
 */
export default function HelixCanvas({ className, animate = true }: HelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (phase: number) => {
      context.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      // One full turn roughly every 420px of height, centred horizontally.
      const turns = height / 420;
      const amplitude = Math.min(width * 0.26, 190);
      const centerX = width / 2;
      const steps = 110;

      type Point = { x: number; y: number; depth: number };
      const strandA: Point[] = [];
      const strandB: Point[] = [];

      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const y = t * height;
        const angle = t * turns * Math.PI * 2 + phase;

        strandA.push({ x: centerX + Math.sin(angle) * amplitude, y, depth: Math.cos(angle) });
        strandB.push({
          x: centerX + Math.sin(angle + Math.PI) * amplitude,
          y,
          depth: Math.cos(angle + Math.PI),
        });
      }

      // Rungs first, so the strands read as being in front of them.
      for (let i = 0; i <= steps; i += 4) {
        const a = strandA[i];
        const b = strandB[i];
        const nearness = (a.depth + 1) / 2;

        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(148, 163, 184, ${0.05 + nearness * 0.16})`;
        context.lineWidth = 1;
        context.stroke();
      }

      const drawStrand = (points: Point[], color: string) => {
        context.beginPath();
        points.forEach((point, i) => {
          if (i === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.strokeStyle = `${color}59`; // ~35% alpha
        context.lineWidth = 1.6;
        context.stroke();

        for (let i = 0; i <= steps; i += 4) {
          const point = points[i];
          const nearness = (point.depth + 1) / 2;
          context.beginPath();
          context.arc(point.x, point.y, 1.1 + nearness * 2.4, 0, Math.PI * 2);
          context.fillStyle = `${color}${Math.round((0.18 + nearness * 0.55) * 255)
            .toString(16)
            .padStart(2, '0')}`;
          context.fill();
        }
      };

      drawStrand(strandA, STRAND_A);
      drawStrand(strandB, STRAND_B);
    };

    resize();

    if (!animate) {
      draw(0.6);
      const onResizeStatic = () => {
        resize();
        draw(0.6);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => window.removeEventListener('resize', onResizeStatic);
    }

    let start: number | null = null;
    const loop = (timestamp: number) => {
      if (start === null) start = timestamp;
      // ~55s per full rotation: present, but never competing with the headline.
      draw(((timestamp - start) / 55000) * Math.PI * 2);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [animate]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
