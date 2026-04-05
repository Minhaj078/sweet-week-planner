import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { TimeSlot, DAYS } from '@/types/planner';
import { TaskCell } from './TaskCell';
import catOrange from '@/assets/cat-orange.png';
import catGray from '@/assets/cat-gray.png';
import catCalico from '@/assets/cat-calico.png';
import catWhite from '@/assets/cat-white.png';
import couple from '@/assets/couple.png';

const catImages = [catOrange, catGray, catCalico, catWhite];

interface Props {
  slots: TimeSlot[];
  getTask: (slotId: string, day: number) => any;
  onSetTask: (slotId: string, day: number, text: string) => void;
  onCycleStatus: (slotId: string, day: number) => void;
  onRemoveSlot: (id: string) => void;
}

export function WeeklyGrid({ slots, getTask, onSetTask, onCycleStatus, onRemoveSlot }: Props) {
  return (
    <div className="px-2 md:px-4 pb-28">
      <div className="relative bg-grid-bg rounded-2xl border-2 border-border overflow-hidden shadow-soft">
        {/* Cat decorations on left side */}
        <div className="absolute left-0 top-0 bottom-0 w-0 pointer-events-none z-10 hidden md:block">
          {slots.map((_, i) => (
            i % 3 === 0 && (
              <img
                key={i}
                src={catImages[Math.floor(i / 3) % catImages.length]}
                alt=""
                className="absolute w-10 h-10"
                style={{ top: `${52 + i * 37}px`, left: '-4px' }}
                loading="lazy"
              />
            )
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            {/* Day headers */}
            <thead>
              <tr>
                <th className="w-[85px] md:w-[100px] p-2 bg-grid-bg" />
                {DAYS.map((day, i) => (
                  <th
                    key={day}
                    className="p-2 bg-grid-header text-center border border-border/50"
                  >
                    <span className={`font-handwritten text-sm md:text-base font-bold ${
                      i === 5 ? 'text-primary text-lg' : 'text-foreground'
                    }`}>
                      {day}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {slots.map((slot, rowIdx) => (
                <motion.tr
                  key={slot.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIdx * 0.02 }}
                >
                  <td className="p-1 pr-2 border border-border/50 bg-grid-bg">
                    <div className="flex items-center justify-between">
                      <span className="font-handwritten text-xs md:text-sm font-bold text-foreground whitespace-nowrap">
                        {slot.label}
                      </span>
                      <button
                        onClick={() => onRemoveSlot(slot.id)}
                        className="text-muted-foreground/30 hover:text-destructive transition-colors ml-1 shrink-0"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </td>
                  {DAYS.map((_, dayIdx) => (
                    <td key={dayIdx} className="p-0 border border-border/50">
                      <TaskCell
                        task={getTask(slot.id, dayIdx)}
                        onSetTask={(text) => onSetTask(slot.id, dayIdx, text)}
                        onCycleStatus={() => onCycleStatus(slot.id, dayIdx)}
                        isAlt={rowIdx % 2 === 1}
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {slots.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body">
            <p className="text-4xl mb-3">🌸</p>
            <p className="text-sm">No time slots yet. Tap + to add one!</p>
          </div>
        )}
      </div>

      {/* Bottom quotes and couple illustration */}
      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <span className="font-handwritten text-primary text-lg md:text-xl font-bold">
          Choose to love daily 💕
        </span>
        <img src={couple} alt="" className="w-16 h-16 md:w-20 md:h-20 animate-float" loading="lazy" />
        <span className="font-handwritten text-primary text-lg md:text-xl font-bold">
          Grow up with me 💗
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-body text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-grid-cell border border-border/50" /> Pending</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-mint" /> Done</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-soft-red" /> Missed</span>
      </div>
    </div>
  );
}
