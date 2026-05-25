'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, CalendarDays, LayoutGrid, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ColorPicker, { COLOR_PALETTE } from '@/components/lab-tools/ColorPicker';
import { localDb as db } from '@/lib/localDb';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00–19:00
const SLOT_HEIGHT = 56;

interface Reservation {
  id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  color?: string;
  created_date: string;
  [key: string]: unknown;
}

function timeToFraction(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}
function fractionToTime(fraction: number) {
  const h = Math.floor(fraction);
  const m = Math.round((fraction - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function formatDisplay(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

interface DragVisual { start: number; end: number; }
interface DayColumnProps {
  dateStr: string;
  reservations: Reservation[];
  onDragComplete: (dateStr: string, startTime: string, endTime: string) => void;
  onDelete: (id: string) => void;
}

function DayColumn({ dateStr, reservations, onDragComplete, onDelete }: DayColumnProps) {
  const draggingRef = useRef(false);
  const dragStartRef = useRef<number | null>(null);
  const dragEndRef = useRef<number | null>(null);
  const [dragVisual, setDragVisual] = useState<DragVisual | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const totalHours = HOURS.length;

  const getYFraction = useCallback((clientY: number) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const y = (clientY - rect.top) / rect.height;
    const fraction = HOURS[0] + y * totalHours;
    const snapped = Math.round(fraction * 4) / 4;
    return Math.max(HOURS[0], Math.min(HOURS[HOURS.length - 1], snapped));
  }, [totalHours]);

  const startDrag = useCallback((clientY: number) => {
    const f = getYFraction(clientY);
    if (f === null) return;
    draggingRef.current = true;
    dragStartRef.current = f;
    dragEndRef.current = f;
    setDragVisual({ start: f, end: f });
  }, [getYFraction]);

  const moveDrag = useCallback((clientY: number) => {
    if (!draggingRef.current) return;
    const f = getYFraction(clientY);
    if (f !== null) {
      dragEndRef.current = f;
      setDragVisual({ start: dragStartRef.current!, end: f });
    }
  }, [getYFraction]);

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const start = dragStartRef.current;
    const end = dragEndRef.current;
    setDragVisual(null);
    if (start !== null && end !== null && Math.abs(end - start) >= 0.25) {
      const s = Math.min(start, end);
      const e = Math.max(start, end);
      const overlaps = reservations.some(r => {
        const rs = timeToFraction(r.start_time);
        const re = timeToFraction(r.end_time);
        return s < re && e > rs;
      });
      if (overlaps) {
        toast.error('That time overlaps with an existing reservation.');
      } else {
        onDragComplete(dateStr, fractionToTime(s), fractionToTime(e));
      }
    }
    dragStartRef.current = null;
    dragEndRef.current = null;
  }, [reservations, dateStr, onDragComplete]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientY);
    const onMouseUp = () => endDrag();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [moveDrag, endDrag]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); startDrag(e.touches[0].clientY); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); moveDrag(e.touches[0].clientY); };
    const onTouchEnd = (e: TouchEvent) => { e.preventDefault(); endDrag(); };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [startDrag, moveDrag, endDrag]);

  return (
    <div
      ref={gridRef}
      className="relative flex-1 cursor-crosshair select-none border-l border-border/40"
      style={{ height: SLOT_HEIGHT * HOURS.length, touchAction: 'none' }}
      onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); startDrag(e.clientY); }}
    >
      {HOURS.map((_, i) => (
        <div key={i} className="absolute left-0 right-0 border-t border-border/40" style={{ top: i * SLOT_HEIGHT }} />
      ))}
      {HOURS.map((_, i) => (
        <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-border/20 border-dashed" style={{ top: i * SLOT_HEIGHT + SLOT_HEIGHT / 2 }} />
      ))}

      {reservations.map((r) => {
        const topFrac = (timeToFraction(r.start_time) - HOURS[0]) / totalHours;
        const heightFrac = (timeToFraction(r.end_time) - timeToFraction(r.start_time)) / totalHours;
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-0.5 right-0.5 rounded-lg px-2 py-1 flex items-start justify-between group overflow-hidden z-10"
            style={{
              top: `${topFrac * 100}%`,
              height: `${Math.max(heightFrac * 100, 3)}%`,
              backgroundColor: r.color || COLOR_PALETTE[0],
              minHeight: 28,
            }}
          >
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate leading-tight">{r.user_name}</div>
              <div className="text-white/80 text-xs leading-tight">{formatDisplay(r.start_time)}–{formatDisplay(r.end_time)}</div>
            </div>
            <button
              className="md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity p-1 hover:bg-white/20 rounded shrink-0 touch-manipulation"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(r.id); }}
            >
              <Trash2 size={12} className="text-white" />
            </button>
          </motion.div>
        );
      })}

      {dragVisual && Math.abs(dragVisual.end - dragVisual.start) >= 0.05 && (
        <div
          className="absolute left-0.5 right-0.5 rounded-lg border-2 border-primary/70 pointer-events-none z-20"
          style={{
            top: `${(Math.min(dragVisual.start, dragVisual.end) - HOURS[0]) / totalHours * 100}%`,
            height: `${Math.abs(dragVisual.end - dragVisual.start) / totalHours * 100}%`,
            backgroundColor: `${COLOR_PALETTE[0]}22`,
            minHeight: 8,
          }}
        />
      )}
    </div>
  );
}

function MobileDayStrip({ currentDate, onSelect }: { currentDate: Date; onSelect: (d: Date) => void }) {
  const today = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayStr = format(today, 'yyyy-MM-dd');
  const selectedStr = format(currentDate, 'yyyy-MM-dd');

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {days.map((d, i) => {
        const ds = format(d, 'yyyy-MM-dd');
        const isToday = ds === todayStr;
        const isSelected = ds === selectedStr;
        return (
          <button
            key={ds}
            onClick={() => onSelect(d)}
            className={`flex-1 min-w-[40px] flex flex-col items-center py-2 rounded-xl transition-all touch-manipulation ${
              isSelected ? 'bg-primary text-primary-foreground shadow-sm'
              : isToday ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground'
            }`}
          >
            <span className="text-[10px] font-semibold uppercase">{DAY_LABELS[i]}</span>
            <span className="text-sm font-bold mt-0.5">{format(d, 'd')}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function BSCScheduler() {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ dateStr: string; startTime: string; endTime: string } | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const queryClient = useQueryClient();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const weekDateStrs = weekDates.map(d => format(d, 'yyyy-MM-dd'));
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { data: dayReservations = [] } = useQuery({
    queryKey: ['bsc_reservations', dateStr],
    queryFn: () => db.entities.BSC_Reservation.filter({ date: dateStr }) as Promise<Reservation[]>,
    enabled: viewMode === 'day',
  });

  const { data: allReservations = [] } = useQuery({
    queryKey: ['bsc_reservations_week', weekDateStrs[0]],
    queryFn: () => db.entities.BSC_Reservation.list() as Promise<Reservation[]>,
    enabled: viewMode === 'week',
  });
  const weekReservations = (allReservations as Reservation[]).filter(r => weekDateStrs.includes(r.date));

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768 && viewMode === 'week') setViewMode('day');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [viewMode]);

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => db.entities.BSC_Reservation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bsc_reservations'] });
      queryClient.invalidateQueries({ queryKey: ['bsc_reservations_week'] });
      toast.success('Reservation created!');
      setShowModal(false);
      setUserName('');
      setPendingSlot(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => db.entities.BSC_Reservation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bsc_reservations'] });
      queryClient.invalidateQueries({ queryKey: ['bsc_reservations_week'] });
      toast.success('Reservation removed');
    },
  });

  const handleDragComplete = (date: string, startTime: string, endTime: string) => {
    setPendingSlot({ dateStr: date, startTime, endTime });
    setShowModal(true);
  };

  const handleReserve = () => {
    if (!userName.trim()) { toast.error('Please enter your name'); return; }
    if (!pendingSlot) return;
    createMutation.mutate({
      user_name: userName.trim(),
      date: pendingSlot.dateStr,
      start_time: pendingSlot.startTime,
      end_time: pendingSlot.endTime,
      color: selectedColor,
    });
  };

  const navigate = (dir: number) => {
    if (viewMode === 'day') setCurrentDate(d => dir > 0 ? addDays(d, 1) : subDays(d, 1));
    else setCurrentDate(d => dir > 0 ? addDays(d, 7) : subDays(d, 7));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">BSC Hood Scheduler</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Click and drag to reserve time slots</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'day' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <CalendarDays size={13} /> Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'week' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={13} /> Week
            </button>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation text-foreground"><ChevronLeft size={16} /></button>
          <div className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-center min-w-[120px] md:min-w-[160px] text-foreground">
            {viewMode === 'day'
              ? <><span className="hidden sm:inline">{format(currentDate, 'EEEE, ')}</span>{format(currentDate, 'MMM d, yyyy')}</>
              : `${format(weekDates[0], 'MMM d')} – ${format(weekDates[6], 'MMM d, yyyy')}`
            }
          </div>
          <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation text-foreground"><ChevronRight size={16} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity touch-manipulation">
            Today
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <MobileDayStrip currentDate={currentDate} onSelect={setCurrentDate} />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex">
          <div className="w-14 shrink-0 border-r border-border">
            {viewMode === 'week' && <div style={{ height: 40 }} className="border-b border-border" />}
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-end pr-2" style={{ height: SLOT_HEIGHT }}>
                <span className="text-xs text-muted-foreground" style={{ marginTop: -9 }}>{String(h).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>

          {viewMode === 'day' && (
            <DayColumn
              dateStr={dateStr}
              reservations={dayReservations as Reservation[]}
              onDragComplete={handleDragComplete}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}

          {viewMode === 'week' && (
            <div className="flex flex-1 overflow-x-auto">
              {weekDates.map((d, i) => {
                const ds = format(d, 'yyyy-MM-dd');
                const isToday = ds === format(new Date(), 'yyyy-MM-dd');
                return (
                  <div key={ds} className="flex-1 flex flex-col min-w-[80px]">
                    <div className={`h-10 flex flex-col items-center justify-center border-b border-l border-border/40 text-xs font-medium ${isToday ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                      <span>{DAY_LABELS[i]}</span>
                      <span className={`text-xs ${isToday ? 'font-bold text-primary' : ''}`}>{format(d, 'MMM d')}</span>
                    </div>
                    <DayColumn
                      dateStr={ds}
                      reservations={weekReservations.filter(r => r.date === ds)}
                      onDragComplete={handleDragComplete}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => { if (!open) { setShowModal(false); setPendingSlot(null); } }}>
        <DialogContent className="sm:max-w-sm" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Reserve Time Slot</DialogTitle>
          </DialogHeader>
          {pendingSlot && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              <Clock size={14} className="shrink-0" />
              <span>
                {format(new Date(pendingSlot.dateStr + 'T12:00:00'), 'EEE, MMM d')}
                {' · '}
                {formatDisplay(pendingSlot.startTime)} – {formatDisplay(pendingSlot.endTime)}
              </span>
            </div>
          )}
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label>Your Name</Label>
              <Input
                placeholder="e.g. Dr. Sarah Chen"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReserve()}
              />
            </div>
            <ColorPicker value={selectedColor} onChange={setSelectedColor} label="Block Color" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="touch-manipulation" onClick={() => { setShowModal(false); setPendingSlot(null); }}>Cancel</Button>
            <Button className="touch-manipulation" onClick={handleReserve} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Reserve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
