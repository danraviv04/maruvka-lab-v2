'use client';

import { useEffect, useRef } from 'react';

type HelixCanvasProps = {
  className?: string;
  /** When false, one static frame is drawn and no loop starts. */
  animate?: boolean;
  /** Horizontal centre, as a fraction of width. Default sits beside the text. */
  centerRatio?: number;
};

/**
 * A slowly rotating DNA double helix, drawn on a canvas as the hero backdrop.
 *
 * Shaped like real B-DNA rather than two mirrored sine waves. Three things do
 * most of that work: the strands are 140° apart rather than 180°, which is
 * what produces the alternating wide and narrow grooves everyone recognises;
 * everything is drawn back half first so the near strand genuinely passes in
 * front of the far one; and size, brightness and line weight all fall off with
 * depth, which reads as perspective.
 *
 * It is the lab's mark, not wallpaper, so it is drawn at full strength: heavy
 * backbones, a halo pass behind the near strand, and solid base-pair nodes.
 *
 * It is a few KB of code rather than a multi-megabyte video, and it never
 * blocks first paint. HeroStage lays a video over it if one ever exists.
 */

/** Degrees between the two strands. 180° gives even grooves and looks wrong. */
const STRAND_SEPARATION = (140 * Math.PI) / 180;

type Palette = { strandA: string; strandB: string; rung: string; alpha: number };

// Both strands are green, in two values rather than two hues, so the helix
// reads as one object and matches the green accent the rest of the page uses.
const DARK: Palette = { strandA: '#34d399', strandB: '#a7f3d0', rung: '#5eead4', alpha: 1 };
const LIGHT: Palette = { strandA: '#047857', strandB: '#10b981', rung: '#059669', alpha: 0.95 };

function rgba(hex: string, alpha: number): string {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

export default function HelixCanvas({
  className,
  animate = true,
  centerRatio = 0.72,
}: HelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let palette: Palette = document.documentElement.classList.contains('dark') ? DARK : LIGHT;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    type Node = { x: number; y: number; near: number };

    const draw = (phase: number) => {
      context.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const turns = height / 460;
      // On a phone the text runs the full width, so a helix this bold would
      // cross the paragraph. There it becomes a narrower edge motif, pushed
      // right and dimmed, rather than a backdrop behind the words.
      const narrow = width < 640;
      const amplitude = Math.min(width * (narrow ? 0.14 : 0.21), 205);
      const centerX = width * (narrow ? 0.86 : centerRatio);
      const steps = 150;
      const rungEvery = 6;
      const { strandA, strandB, rung } = palette;
      const tone = palette.alpha * (narrow ? 0.6 : 1);

      const nodesA: Node[] = [];
      const nodesB: Node[] = [];

      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        // A slight lean stops it reading as a flat ribbon pinned to the edge.
        const y = t * height;
        const lean = (t - 0.5) * width * 0.045;
        const angle = t * turns * Math.PI * 2 + phase;

        nodesA.push({
          x: centerX + lean + Math.sin(angle) * amplitude,
          y,
          near: (Math.cos(angle) + 1) / 2,
        });
        nodesB.push({
          x: centerX + lean + Math.sin(angle + STRAND_SEPARATION) * amplitude,
          y,
          near: (Math.cos(angle + STRAND_SEPARATION) + 1) / 2,
        });
      }

      /** One base pair: two halves meeting in the middle, coloured per strand. */
      const drawRung = (i: number) => {
        const a = nodesA[i];
        const b = nodesB[i];
        const near = (a.near + b.near) / 2;
        const midX = (a.x + b.x) / 2;

        context.lineWidth = 1.5 + near * 2.6;
        context.lineCap = 'round';

        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(midX, (a.y + b.y) / 2);
        context.strokeStyle = rgba(strandA, (0.14 + near * 0.48) * tone);
        context.stroke();

        context.beginPath();
        context.moveTo(midX, (a.y + b.y) / 2);
        context.lineTo(b.x, b.y);
        context.strokeStyle = rgba(rung, (0.12 + near * 0.44) * tone);
        context.stroke();
      };

      /**
       * A run of backbone between two indices, weighted by depth. The near half
       * gets a wide, faint pass underneath it first, which reads as a glow
       * without the cost of canvas shadowBlur on every segment.
       */
      const drawBackbone = (nodes: Node[], color: string, from: number, to: number) => {
        const trace = () => {
          context.beginPath();
          for (let i = from; i <= to; i += 1) {
            const point = nodes[i];
            if (i === from) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
        };

        const near = nodes[Math.floor((from + to) / 2)].near;
        context.lineJoin = 'round';
        context.lineCap = 'round';

        if (near >= 0.5) {
          trace();
          context.lineWidth = 10 + near * 10;
          context.strokeStyle = rgba(color, 0.1 * tone);
          context.stroke();
        }

        trace();
        context.lineWidth = 2.4 + near * 4.4;
        context.strokeStyle = rgba(color, (0.34 + near * 0.62) * tone);
        context.stroke();
      };

      const drawNodes = (nodes: Node[], color: string, wantNear: boolean) => {
        for (let i = 0; i <= steps; i += rungEvery) {
          const point = nodes[i];
          if (point.near >= 0.5 !== wantNear) continue;

          context.beginPath();
          context.arc(point.x, point.y, 1.8 + point.near * 4.6, 0, Math.PI * 2);
          context.fillStyle = rgba(color, (0.34 + point.near * 0.62) * tone);
          context.fill();
        }
      };

      // Painter's algorithm, in depth bands: everything behind the axis, then
      // the rungs, then everything in front. This is what makes one strand
      // visibly cross over the other instead of the two simply intersecting.
      const paintBackbone = (wantNear: boolean) => {
        for (const [nodes, color] of [
          [nodesA, strandA],
          [nodesB, strandB],
        ] as const) {
          let runStart: number | null = null;

          for (let i = 0; i <= steps; i += 1) {
            const isNear = nodes[i].near >= 0.5;

            if (isNear === wantNear) {
              if (runStart === null) runStart = i;
            } else if (runStart !== null) {
              if (i - runStart > 1) drawBackbone(nodes, color, runStart, i - 1);
              runStart = null;
            }
          }

          if (runStart !== null && steps - runStart > 1) {
            drawBackbone(nodes, color, runStart, steps);
          }
        }
      };

      paintBackbone(false);
      drawNodes(nodesA, strandA, false);
      drawNodes(nodesB, strandB, false);

      for (let i = 0; i <= steps; i += rungEvery) drawRung(i);

      paintBackbone(true);
      drawNodes(nodesA, strandA, true);
      drawNodes(nodesB, strandB, true);
    };

    resize();

    // The hero is light in light mode and dark in dark mode, so the helix has
    // to follow the theme rather than assume a dark backdrop.
    const themeObserver = new MutationObserver(() => {
      palette = document.documentElement.classList.contains('dark') ? DARK : LIGHT;
      if (!animate) draw(0.6);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (!animate) {
      draw(0.6);
      const onResizeStatic = () => {
        resize();
        draw(0.6);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => {
        themeObserver.disconnect();
        window.removeEventListener('resize', onResizeStatic);
      };
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
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [animate, centerRatio]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
