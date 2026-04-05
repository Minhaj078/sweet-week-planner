import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { TimeSlot, DAYS } from '@/types/planner';
import { TaskCell } from './TaskCell';

interface Props {
  slots: TimeSlot[];
  getTask: (slotId: string, day: number) => any;
  onSetTask: (slotId: string, day: number, text: string) => void;
  onCycleStatus: (slotId: string, day: number) => void;
  onRemoveSlot: (id: string) => void;
}

export function WeeklyGrid({ slots, getTask, onSetTask, onCycleStatus, onRemoveSlot }: Props) {
  return (
    <div className="px-2 md:px-4 pb-24 overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Day headers */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1.5 mb-2 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
          <div />
          {DAYS.map((day, i) => (
            <div key={day} className="text-center">
              <span className={`text-[11px] md:text-xs font-bold font-display ${
                i === 0 || i === 6 ? 'text-primary' : 'text-foreground'
              }`}>
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {slots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground font-body"
          >
            <p className="text-4xl mb-3">🌸</p>
            <p className="text-sm">No time slots yet. Tap + to add one!</p>
          </motion.div>
        )}

        {slots.map((slot, idx) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="grid grid-cols-[100px_repeat(7,1fr)] gap-1.5 mb-1.5"
          >
            <div className="flex items-center gap-1 pr-1">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold font-display text-foreground truncate">{slot.label}</p>
                <p className="text-[9px] text-muted-foreground font-body">{slot.startTime}–{slot.endTime}</p>
              </div>
              <button
                onClick={() => onRemoveSlot(slot.id)}
                className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0 p-0.5"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {DAYS.map((_, dayIdx) => (
              <TaskCell
                key={dayIdx}
                task={getTask(slot.id, dayIdx)}
                onSetTask={(text) => onSetTask(slot.id, dayIdx, text)}
                onCycleStatus={() => onCycleStatus(slot.id, dayIdx)}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-body text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-cream border border-border" /> Pending</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-mint" /> Done</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-soft-red" /> Missed</span>
      </div>
    </div>
  );
}
