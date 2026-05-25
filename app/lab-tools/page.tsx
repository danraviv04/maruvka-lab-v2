'use client';

import Link from 'next/link';
import { FlaskConical, CalendarDays, Users, ShoppingCart, FolderOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    href: '/lab-tools/bsc',
    icon: CalendarDays,
    title: 'BSC Hood Scheduler',
    description: 'Reserve biosafety cabinet time slots. Drag to create blocks — no double-bookings, daily & weekly views.',
    color: '#0D7A7A',
    bg: 'bg-teal-50',
  },
  {
    href: '/lab-tools/meeting',
    icon: Users,
    title: 'Lab Meeting Scheduler',
    description: 'Paint your weekly availability. The system overlays a heatmap to find the best time for everyone.',
    color: '#0891b2',
    bg: 'bg-sky-50',
  },
  {
    href: '/lab-tools/procurement',
    icon: ShoppingCart,
    title: 'Procurement Requests',
    description: 'Submit reagent & equipment requests. Track status from pending through to received.',
    color: '#7c3aed',
    bg: 'bg-violet-50',
  },
  {
    href: '/lab-tools/sop',
    icon: FolderOpen,
    title: 'Protocol Library',
    description: 'Upload, organize and color-tag SOPs & protocols. Drag PDFs into folders for instant organization.',
    color: '#b45309',
    bg: 'bg-amber-50',
  },
];

export default function LabToolsHome() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-8 pb-4 space-y-5"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <FlaskConical size={40} className="text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Maruvka <span className="text-primary">Lab Tools</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Internal laboratory management platform. Schedule equipment, coordinate meetings, track procurement, and manage protocols — all in one place.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="h-px w-16 bg-border" />
          <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Lab Tools</span>
          <div className="h-px w-16 bg-border" />
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {features.map(({ href, icon: Icon, title, description, color, bg }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <Link
              href={href}
              className="group block bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-border/60 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`${bg} rounded-xl p-3 shrink-0`}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-foreground text-sm">{title}</h2>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">Maruvka Lab · Internal Tools · Data stored locally in browser</p>
      </div>
    </div>
  );
}
