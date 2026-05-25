'use client';

import { Palette } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

export const COLOR_PALETTE = [
  '#0D7A7A', '#0891b2', '#06b6d4', '#0e7490', '#164e63',
  '#1d4ed8', '#2563eb', '#3b82f6', '#1e40af', '#1e3a8a',
  '#7c3aed', '#8b5cf6', '#9333ea', '#6d28d9', '#4c1d95',
  '#be185d', '#ec4899', '#f43f5e', '#e11d48', '#9f1239',
  '#dc2626', '#ef4444', '#f97316', '#ea580c', '#9a3412',
  '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#92400e',
  '#15803d', '#16a34a', '#22c55e', '#166534', '#14532d',
  '#475569', '#64748b', '#94a3b8', '#334155', '#1e293b',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ value, onChange, label = 'Color Tag' }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <Palette size={12} /> {label}
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map(c => (
          <button
            key={c}
            type="button"
            className={`w-6 h-6 rounded-full transition-all ${
              value === c
                ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                : 'hover:scale-110 hover:ring-1 hover:ring-offset-1 hover:ring-muted-foreground'
            }`}
            style={{ backgroundColor: c }}
            onClick={() => onChange(c)}
          />
        ))}
        <div className="relative">
          <button
            type="button"
            title="Custom color"
            className="w-6 h-6 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center text-muted-foreground hover:text-primary text-xs"
            onClick={() => setShowCustom(v => !v)}
          >
            +
          </button>
          {showCustom && (
            <div className="absolute top-8 left-0 z-10 bg-card border border-border rounded-lg p-2 shadow-md">
              <input
                type="color"
                value={value || '#000000'}
                onChange={e => onChange(e.target.value)}
                className="w-24 h-8 rounded cursor-pointer border-0"
              />
            </div>
          )}
        </div>
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value }} />
          <span className="text-xs text-muted-foreground font-mono">{value}</span>
        </div>
      )}
    </div>
  );
}
