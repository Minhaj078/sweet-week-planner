import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlannerView } from '@/types/planner';

interface Props {
  view: PlannerView;
  onViewChange: (v: PlannerView) => void;
}

export function PlannerHeader({ view, onViewChange }: Props) {
  return (
    <header className="text-center pt-6 pb-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Sparkles className="text-primary" size={20} />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Weekly Planner
        </h1>
        <Heart className="text-primary animate-float" size={20} fill="hsl(var(--primary))" />
      </motion.div>

      <div className="inline-flex bg-card rounded-2xl p-1 shadow-card">
        {(['my', 'partner'] as const).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`relative px-5 py-2 rounded-xl text-sm font-semibold font-body transition-all duration-300 ${
              view === v ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {view === v && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {v === 'my' ? '💕 My Routine' : '💝 Partner Routine'}
            </span>
          </button>
        ))}
      </div>
    </header>
  );
}
