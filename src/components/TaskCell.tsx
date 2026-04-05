import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlannerTask } from '@/types/planner';
import { Check, X as XIcon } from 'lucide-react';

interface Props {
  task?: PlannerTask;
  onSetTask: (text: string) => void;
  onCycleStatus: () => void;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-cream border-border',
  completed: 'bg-mint border-mint',
  missed: 'bg-soft-red border-soft-red',
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <Check size={10} className="text-accent-foreground" />,
  missed: <XIcon size={10} className="text-destructive" />,
};

export function TaskCell({ task, onSetTask, onCycleStatus }: Props) {
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

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onDoubleClick={() => { setEditing(true); setText(task?.text || ''); }}
        className={`w-full min-h-[44px] rounded-xl border text-[10px] md:text-xs p-1.5 font-body leading-tight transition-colors duration-200 ${statusStyles[status]} ${
          task?.text ? 'cursor-pointer' : 'cursor-pointer hover:bg-blush/40'
        }`}
      >
        {task?.text ? (
          <span className="flex items-center gap-0.5 justify-center flex-wrap">
            {statusIcons[status]}
            <span className="truncate max-w-full">{task.text}</span>
          </span>
        ) : (
          <span className="text-muted-foreground/50">+</span>
        )}
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
              className="bg-card rounded-2xl shadow-soft p-5 w-full max-w-xs"
            >
              <h4 className="font-display font-bold text-sm mb-3 text-foreground">📝 What's planned?</h4>
              <input
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="e.g. Gym, Reading..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 mb-3"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold font-body hover:opacity-90 transition-opacity">
                  Save ✨
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-muted text-muted-foreground rounded-xl py-2 text-sm font-semibold font-body hover:bg-border transition-colors">
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
