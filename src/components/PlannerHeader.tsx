import { motion } from 'framer-motion';
import { PlannerView } from '@/types/planner';
import catOrange from '@/assets/cat-orange.png';
import catGray from '@/assets/cat-gray.png';
import catCalico from '@/assets/cat-calico.png';
import plant from '@/assets/plant.png';

interface Props {
  view: PlannerView;
  onViewChange: (v: PlannerView) => void;
}

export function PlannerHeader({ view, onViewChange }: Props) {
  return (
    <header className="relative pt-4 pb-2 px-4 overflow-hidden">
      {/* Decorative cats in header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src={catOrange} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
        <img src={catGray} alt="" className="w-12 h-12 md:w-16 md:h-16" />
        <img src={catCalico} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h1 className="text-3xl md:text-4xl font-handwritten text-primary font-bold tracking-wide">
          Weekly Planner
        </h1>
        <p className="text-xs font-handwritten text-muted-foreground mt-0.5">
          Of my MadOm 🎀 <span className="text-[10px]">Content creator</span>
        </p>
      </motion.div>

      {/* Plant decoration */}
      <img src={plant} alt="" className="absolute top-2 right-2 w-12 h-12 md:w-16 md:h-16 opacity-80" loading="lazy" />

      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex bg-card rounded-2xl p-1 shadow-card">
          {(['my', 'partner'] as const).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`relative px-4 py-1.5 rounded-xl text-sm font-bold font-handwritten transition-all duration-300 ${
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
                {v === 'my' ? '💕 My Routine' : '💝 Partner'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
