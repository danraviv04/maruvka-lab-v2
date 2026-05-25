'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UserPlus, RotateCcw, ChevronLeft, ChevronRight, Save, Users, X, Plus } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { localDb as db } from '@/lib/localDb';

const DAY_INDICES = [0, 1, 2, 3, 4]; // Sun–Thu
const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 7:00–19:00
const ROW_H = 26;

interface AvailabilityRecord {
  id: string;
  user_name: string;
  date: string;
  time_slot: string;
  created_date: string;
  [key: string]: unknown;
}

function slotKey(dateStr: string, hour: number, half: number) {
  return `${dateStr}|${String(hour).padStart(2, '0')}:${half ? '30' : '00'}`;
}
function heatBg(ratio: number) {
  if (ratio === 0) return 'transparent';
  if (ratio <= 0.25) return '#ccfbf1';
  if (ratio <= 0.5) return '#5eead4';
  if (ratio <= 0.75) return '#14b8a6';
  return '#0f766e';
}
function heatText(ratio: number) {
  return ratio > 0.5 ? '#ffffff' : '#134e4a';
}

function TimeLabels() {
  return (
    <div className="shrink-0 w-12 pt-10 select-none">
      {HOURS.flatMap((h) => [0, 1].map(half => (
        <div key={`${h}-${half}`} className="flex items-start justify-end pr-1.5" style={{ height: ROW_H }}>
          {half === 0 && (
            <span className="text-[10px] text-muted-foreground leading-none -mt-[6px]">
              {String(h).padStart(2, '0')}:00
            </span>
          )}
        </div>
      )))}
    </div>
  );
}

interface MyGridProps {
  weekDateStrs: string[];
  mySlots: Set<string>;
  setMySlots: React.Dispatch<React.SetStateAction<Set<string>>>;
  disabled: boolean;
}

function MyGrid({ weekDateStrs, mySlots, setMySlots, disabled }: MyGridProps) {
  const isPainting = useRef(false);
  const paintMode = useRef(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stop = () => { isPainting.current = false; };
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, []);

  const getKeyFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    if (!el) return null;
    return el.dataset.slotkey || null;
  }, []);

  const paintKey = (key: string | null) => {
    if (!key || disabled) return;
    setMySlots(prev => {
      const next = new Set(prev);
      paintMode.current ? next.add(key) : next.delete(key);
      return next;
    });
  };

  const down = (key: string) => {
    if (disabled) return;
    isPainting.current = true;
    paintMode.current = !mySlots.has(key);
    paintKey(key);
  };

  const enter = (key: string) => {
    if (disabled || !isPainting.current) return;
    paintKey(key);
  };

  useEffect(() => {
    const el = gridRef.current;
    if (!el || disabled) return;
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const key = getKeyFromPoint(touch.clientX, touch.clientY);
      if (!key) return;
      isPainting.current = true;
      paintMode.current = !mySlots.has(key);
      paintKey(key);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isPainting.current) return;
      const touch = e.touches[0];
      const key = getKeyFromPoint(touch.clientX, touch.clientY);
      if (key) paintKey(key);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [disabled, mySlots, getKeyFromPoint]);

  return (
    <div className="flex-1 min-w-0 overflow-x-auto">
      <div ref={gridRef} style={{ minWidth: weekDateStrs.length * 52, touchAction: 'none' }}>
        <div className="grid border-b border-border/60" style={{ gridTemplateColumns: `repeat(${weekDateStrs.length}, 1fr)` }}>
          {weekDateStrs.map((ds) => {
            const isToday = ds === format(new Date(), 'yyyy-MM-dd');
            const d = new Date(ds + 'T12:00:00');
            return (
              <div key={ds} className={`h-10 flex flex-col items-center justify-center border-l border-border/30 ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{format(d, 'EEE')}</span>
                <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>{format(d, 'MMM d')}</span>
              </div>
            );
          })}
        </div>
        <div className={`select-none ${disabled ? 'opacity-40 pointer-events-none' : ''}`} onMouseLeave={() => { isPainting.current = false; }}>
          {HOURS.flatMap(h => [0, 1].map(half => (
            <div
              key={`${h}-${half}`}
              className={`grid ${half === 0 ? 'border-t border-border/50' : 'border-t border-border/20 border-dashed'}`}
              style={{ gridTemplateColumns: `repeat(${weekDateStrs.length}, 1fr)`, height: ROW_H }}
            >
              {weekDateStrs.map(ds => {
                const key = slotKey(ds, h, half);
                const isMine = mySlots.has(key);
                return (
                  <div
                    key={ds}
                    data-slotkey={key}
                    className={`border-l border-border/20 cursor-pointer transition-colors duration-75 ${isMine ? 'bg-primary/80' : 'hover:bg-primary/10'}`}
                    onMouseDown={() => down(key)}
                    onMouseEnter={() => enter(key)}
                  />
                );
              })}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

interface HeatGridProps {
  weekDateStrs: string[];
  heatmapUsers: Record<string, string[]>;
  maxCount: number;
  uniqueUsers: string[];
}

function HeatGrid({ weekDateStrs, heatmapUsers, maxCount, uniqueUsers }: HeatGridProps) {
  const [tooltip, setTooltip] = useState<{ key: string; h: number; half: number; colIndex: number } | null>(null);

  return (
    <div className="flex-1 min-w-0 overflow-x-auto relative">
      <div style={{ minWidth: weekDateStrs.length * 52 }}>
        <div className="grid border-b border-border/60" style={{ gridTemplateColumns: `repeat(${weekDateStrs.length}, 1fr)` }}>
          {weekDateStrs.map((ds) => {
            const isToday = ds === format(new Date(), 'yyyy-MM-dd');
            const d = new Date(ds + 'T12:00:00');
            return (
              <div key={ds} className={`h-10 flex flex-col items-center justify-center border-l border-border/30 ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{format(d, 'EEE')}</span>
                <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>{format(d, 'MMM d')}</span>
              </div>
            );
          })}
        </div>
        <div>
          {HOURS.flatMap(h => [0, 1].map(half => (
            <div
              key={`${h}-${half}`}
              className={`grid ${half === 0 ? 'border-t border-border/50' : 'border-t border-border/20 border-dashed'}`}
              style={{ gridTemplateColumns: `repeat(${weekDateStrs.length}, 1fr)`, height: ROW_H }}
            >
              {weekDateStrs.map((ds, colIndex) => {
                const key = slotKey(ds, h, half);
                const users = heatmapUsers[key] || [];
                const count = users.length;
                const ratio = count / Math.max(maxCount, 1);
                const bg = heatBg(ratio);
                const tc = heatText(ratio);
                return (
                  <div
                    key={ds}
                    className="relative border-l border-border/20 flex items-center justify-center cursor-default transition-all duration-75"
                    style={{ backgroundColor: bg }}
                    onMouseEnter={() => count > 0 && setTooltip({ key, h, half, colIndex })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {count > 0 && (
                      <span className="text-[10px] font-bold leading-none" style={{ color: tc }}>{count}</span>
                    )}
                    {tooltip?.key === key && (
                      <div className={`absolute bottom-full mb-1.5 z-50 pointer-events-none ${
                        colIndex === 0 ? 'left-0' : colIndex === weekDateStrs.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                      }`}>
                        <div className="bg-white border border-border rounded-xl shadow-2xl p-3 w-44 text-left">
                          <div className="text-xs font-semibold text-foreground mb-2">
                            {String(h).padStart(2, '0')}:{half ? '30' : '00'}
                          </div>
                          {users.length > 0 && (
                            <div className="mb-1.5">
                              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">Available</div>
                              {users.map(u => (
                                <div key={u} className="flex items-center gap-1.5 text-xs text-foreground py-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                          {uniqueUsers.filter(u => !users.includes(u)).length > 0 && (
                            <div>
                              <div className="text-[10px] font-semibold text-rose-500 uppercase tracking-wide mb-1">Unavailable</div>
                              {uniqueUsers.filter(u => !users.includes(u)).map(u => (
                                <div key={u} className="flex items-center gap-1.5 text-xs text-muted-foreground py-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

function JoinPanel({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
      <UserPlus size={16} className="text-primary shrink-0" />
      <span className="text-sm text-foreground font-medium shrink-0">Add my availability:</span>
      <Input
        placeholder="Enter your name…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onSubmit(name.trim())}
        className="h-8 text-sm flex-1 min-w-[140px]"
        autoFocus
      />
      <Button size="sm" disabled={!name.trim()} onClick={() => onSubmit(name.trim())}>
        <Plus size={13} className="mr-1" /> Join
      </Button>
    </div>
  );
}

export default function LabMeeting() {
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState('');
  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [mySlots, setMySlots] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [mobileTab, setMobileTab] = useState<'mine' | 'group'>('group');

  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), weekOffset);
  const weekDates = DAY_INDICES.map(i => addDays(weekStart, i));
  const weekDateStrs = weekDates.map(d => format(d, 'yyyy-MM-dd'));

  const { data: allAvailabilities = [] } = useQuery({
    queryKey: ['meeting_availability'],
    queryFn: () => db.entities.Meeting_Availability.list() as Promise<AvailabilityRecord[]>,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (name: string) => {
      const records = (allAvailabilities as AvailabilityRecord[]).filter(a => a.user_name === name);
      await Promise.all(records.map(a => db.entities.Meeting_Availability.delete(a.id)));
    },
    onSuccess: (_, name) => {
      queryClient.invalidateQueries({ queryKey: ['meeting_availability'] });
      toast.success(`Removed ${name}'s availability`);
      if (name === userName) {
        setUserName(''); setMySlots(new Set()); setSaved(false); setShowJoinPanel(false);
      }
    },
  });

  const bulkSaveMutation = useMutation({
    mutationFn: async (slots: string[]) => {
      const existing = (allAvailabilities as AvailabilityRecord[]).filter(a => a.user_name === userName);
      await Promise.all(existing.map(a => db.entities.Meeting_Availability.delete(a.id)));
      if (slots.length > 0) {
        await db.entities.Meeting_Availability.bulkCreate(
          slots.map(s => { const [date, time] = s.split('|'); return { user_name: userName, date, time_slot: time }; })
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting_availability'] });
      toast.success('Availability saved!');
      setSaved(true);
    },
  });

  const resetAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all((allAvailabilities as AvailabilityRecord[]).map(a => db.entities.Meeting_Availability.delete(a.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting_availability'] });
      setMySlots(new Set()); setSaved(false); setUserName(''); setShowJoinPanel(false);
      toast.success('All availability reset');
    },
  });

  const heatmapUsers: Record<string, string[]> = {};
  (allAvailabilities as AvailabilityRecord[]).forEach(a => {
    const key = `${a.date}|${a.time_slot}`;
    if (!heatmapUsers[key]) heatmapUsers[key] = [];
    if (!heatmapUsers[key].includes(a.user_name)) heatmapUsers[key].push(a.user_name);
  });
  const visibleCounts = weekDateStrs.flatMap(ds =>
    HOURS.flatMap(h => [0, 1].map(half => (heatmapUsers[slotKey(ds, h, half)] || []).length))
  );
  const maxCount = Math.max(...visibleCounts, 1);
  const uniqueUsers = [...new Set((allAvailabilities as AvailabilityRecord[]).map(a => a.user_name))];

  const handleJoin = (name: string) => {
    setUserName(name);
    setShowJoinPanel(false);
    const userSlots = (allAvailabilities as AvailabilityRecord[]).filter(a => a.user_name === name).map(a => `${a.date}|${a.time_slot}`);
    setMySlots(new Set(userSlots));
    if (userSlots.length > 0) setSaved(true);
    setMobileTab('mine');
  };

  const isEditing = !!userName;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lab Meeting Scheduler</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditing
              ? <>Editing as <span className="font-medium text-primary">{userName}</span> · <button className="text-xs underline hover:text-foreground" onClick={() => { setUserName(''); setMySlots(new Set()); setSaved(false); }}>switch user</button></>
              : 'Find the best time for the whole team'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded-md hover:bg-card transition-colors text-foreground"><ChevronLeft size={14} /></button>
            <span className="px-2 text-xs font-medium text-foreground min-w-[110px] text-center">
              {format(weekDates[0], 'MMM d')} – {format(weekDates[4], 'MMM d')}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-md hover:bg-card transition-colors text-foreground"><ChevronRight size={14} /></button>
          </div>
          <button onClick={() => setWeekOffset(0)} className="px-2.5 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
            This week
          </button>
          {isEditing && <Button variant="outline" size="sm" onClick={() => setMySlots(new Set())}>Clear</Button>}
          <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50"
            onClick={() => { if (window.confirm('Reset ALL availability?')) resetAllMutation.mutate(); }}
            disabled={resetAllMutation.isPending}
          >
            <RotateCcw size={12} className="mr-1 hidden sm:inline" /> Reset
          </Button>
          {isEditing ? (
            <Button size="sm" onClick={() => bulkSaveMutation.mutate([...mySlots])} disabled={bulkSaveMutation.isPending}>
              <Save size={13} className="mr-1" />
              {bulkSaveMutation.isPending ? 'Saving…' : saved ? 'Update' : 'Save'}
            </Button>
          ) : (
            <Button size="sm" onClick={() => setShowJoinPanel(v => !v)}>
              <UserPlus size={13} className="mr-1" /> <span className="hidden sm:inline">Add My </span>Availability
            </Button>
          )}
        </div>
      </div>

      {showJoinPanel && !isEditing && <JoinPanel onSubmit={handleJoin} />}

      {uniqueUsers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={13} />
            <span className="font-medium text-foreground">{uniqueUsers.length} participant{uniqueUsers.length !== 1 ? 's' : ''}:</span>
          </div>
          {uniqueUsers.map(u => (
            <span key={u} className={`group flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-medium transition-colors ${u === userName ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {u}
              <button
                className={`rounded-full p-0.5 transition-opacity opacity-0 group-hover:opacity-100 ${u === userName ? 'hover:bg-white/20' : 'hover:bg-foreground/10'}`}
                onClick={() => { if (window.confirm(`Remove ${u}'s availability?`)) deleteUserMutation.mutate(u); }}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex md:hidden bg-muted rounded-xl p-1 gap-1">
        <button
          onClick={() => setMobileTab('mine')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mobileTab === 'mine' ? 'bg-white shadow text-foreground' : 'text-muted-foreground'}`}
        >
          My Availability
        </button>
        <button
          onClick={() => setMobileTab('group')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mobileTab === 'group' ? 'bg-white shadow text-foreground' : 'text-muted-foreground'}`}
        >
          Group View
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className={`bg-card border border-border rounded-2xl overflow-hidden shadow-sm ${mobileTab !== 'mine' ? 'hidden md:block' : ''}`}>
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Your Availability</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEditing ? 'Drag to paint / unpaint slots' : 'Click "Add My Availability" above'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-primary/80" />
              <span>Available</span>
            </div>
          </div>
          <div className="flex overflow-hidden">
            <TimeLabels />
            <MyGrid weekDateStrs={weekDateStrs} mySlots={mySlots} setMySlots={setMySlots} disabled={!isEditing} />
          </div>
        </div>

        <div className={`bg-card border border-border rounded-2xl overflow-hidden shadow-sm ${mobileTab !== 'group' ? 'hidden md:block' : ''}`}>
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Group Availability</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Tap cells to see who&apos;s available</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex gap-0.5 mx-1">
                {['#ccfbf1','#5eead4','#14b8a6','#0f766e'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
          <div className="flex overflow-hidden">
            <TimeLabels />
            <HeatGrid weekDateStrs={weekDateStrs} heatmapUsers={heatmapUsers} maxCount={maxCount} uniqueUsers={uniqueUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
