'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShoppingCart, ExternalLink, Trash2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { localDb as db } from '@/lib/localDb';

const URGENCY_COLORS: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-blue-50 text-blue-700',
  Approved: 'bg-teal-50 text-teal-700',
  Ordered: 'bg-purple-50 text-purple-700',
  Received: 'bg-green-50 text-green-700',
};

interface RequestRecord {
  id: string;
  requested_by?: string;
  item_name?: string;
  url?: string;
  qty?: number;
  urgency?: string;
  notes?: string;
  status?: string;
  created_date: string;
  [key: string]: unknown;
}

const emptyForm = { requested_by: '', item_name: '', url: '', qty: '', urgency: '', notes: '' };

export default function Procurement() {
  const [form, setForm] = useState(emptyForm);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['purchase_requests'],
    queryFn: () => db.entities.Purchase_Request.list('-created_date', 50) as Promise<RequestRecord[]>,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      return db.entities.Purchase_Request.create({
        item_name: data.item_name || undefined,
        url: data.url || undefined,
        qty: data.qty ? Number(data.qty) : undefined,
        urgency: data.urgency || undefined,
        notes: data.notes || undefined,
        requested_by: data.requested_by || undefined,
        status: 'Pending',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase_requests'] });
      toast.success('Request submitted!');
      setForm(emptyForm);
    },
    onError: () => toast.error('Failed to save request. Please try again.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => db.entities.Purchase_Request.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchase_requests'] }),
  });

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await db.entities.Purchase_Request.update(id, { status });
    queryClient.setQueryData(['purchase_requests'], (old: RequestRecord[] | undefined) =>
      old ? old.map(r => r.id === id ? { ...r, status } : r) : old
    );
    setUpdatingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Procurement Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit equipment & reagent requests — all fields optional</p>
      </div>

      <div className="grid lg:grid-cols-[380px,1fr] gap-8 items-start">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart size={16} className="text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">New Request</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Requested by</Label>
              <Input
                placeholder="Your name"
                value={form.requested_by}
                onChange={e => setForm(f => ({ ...f, requested_by: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Item Name</Label>
              <Input
                placeholder="e.g. Fetal Bovine Serum (500mL)"
                value={form.item_name}
                onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Catalog URL</Label>
              <Input
                placeholder="https://sigma-aldrich.com/..."
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.qty}
                  onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Urgency</Label>
                <Select value={form.urgency} onValueChange={v => setForm(f => ({ ...f, urgency: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</Label>
              <Textarea
                placeholder="Any additional details…"
                rows={3}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting…' : 'Submit Request'}
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Recent Requests <span className="text-muted-foreground font-normal text-sm">({(requests as RequestRecord[]).length})</span></h2>
          {(requests as RequestRecord[]).length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No requests yet. Submit your first one!
            </div>
          )}
          <AnimatePresence initial={false}>
            {(requests as RequestRecord[]).map(r => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 group hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{r.item_name || '(unnamed item)'}</span>
                    {r.urgency && <Badge className={`text-xs border-0 ${URGENCY_COLORS[r.urgency] || ''}`}>{r.urgency}</Badge>}
                    {r.status && <Badge className={`text-xs border-0 ${STATUS_COLORS[r.status] || ''}`}>{r.status}</Badge>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {r.requested_by && <span className="font-medium text-foreground">By: {r.requested_by}</span>}
                    {r.qty && <span>Qty: {r.qty}</span>}
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink size={11} /> Link
                      </a>
                    )}
                    <span>{format(new Date(r.created_date), 'MMM d, yyyy')}</span>
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes as string}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Select
                    value={r.status || 'Pending'}
                    onValueChange={v => updateStatus(r.id, v)}
                    disabled={updatingId === r.id}
                  >
                    <SelectTrigger className="h-7 text-xs w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Ordered">Ordered</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(r.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
