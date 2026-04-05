import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (label: string, start: string, end: string) => void;
}

export function AddTimeSlotModal({ open, onClose, onAdd }: Props) {
  const [label, setLabel] = useState('');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('10:00');

  const handleSubmit = () => {
    if (!label.trim()) return;
    onAdd(label.trim(), start, end);
    setLabel('');
    setStart('08:00');
    setEnd('10:00');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-soft p-6 w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-foreground">✨ New Time Slot</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block font-body">Label</label>
                <input
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Morning yoga"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block font-body">Start</label>
                  <input type="time" value={start} onChange={e => setStart(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block font-body">End</label>
                  <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold font-body text-sm hover:opacity-90 transition-opacity mt-2"
              >
                Add Slot 💫
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
