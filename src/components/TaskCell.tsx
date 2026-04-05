import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlannerTask } from '@/types/planner';
import { Check, X as XIcon } from 'lucide-react';

interface Props {
  task?: PlannerTask;
  onSetTask: (text: string) => void;
  onCycleStatus: () => void;
  isAlt: boolean;
}

const statusBg: Record<string, string> = {
  pending: '',
  completed: 'bg-mint',
  missed: 'bg-soft-red',
};

export function TaskCell({ task, onSetTask, onCycleStatus, isAlt }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task?.text || '');

  const handleClick = () => {
    if (task?.text) {
      onCycleStatus();
    } else {
      setEditing(true);
      setText('');
    }
  };

  const handleSave = () => {
    onSetTask(text);
    setEditing(false);
  };

  const status = task?.status || 'pending';
  const baseBg = status === 'pending' ? (isAlt ? 'bg-grid-cell-alt' : 'bg-grid-cell') : statusBg[status];

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={handleClick}
        onDoubleClick={() => { setEditing(true); setText(task?.text || ''); }}
        className={`w-full h-full min-h-[36px] border border-border/50 text-[9px] md:text-[11px] font-body leading-tight transition-colors duration-200 ${baseBg} hover:brightness-95`}
      >
        {task?.text ? (
          <span className="flex items-center gap-0.5 justify-center px-0.5">
            {status === 'completed' && <Check size={8} className="text-accent-foreground shrink-0" />}
            {status === 'missed' && <XIcon size={8} className="text-destructive shrink-0" />}
            <span className="truncate">{task.text}</span>
          </span>
        ) : null}
      </motion.button>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-popover rounded-2xl shadow-soft p-5 w-full max-w-xs border border-border"
            >
              <h4 className="font-handwritten font-bold text-lg mb-3 text-primary">📝 What's planned?</h4>
              <input
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="e.g. Gym, Reading..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 mb-3"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-bold font-handwritten hover:opacity-90 transition-opacity">
                  Save ✨
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-muted text-muted-foreground rounded-xl py-2 text-sm font-bold font-handwritten hover:bg-border transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
