import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Pencil, Check, X } from 'lucide-react';
import { PlannerView, PlannerSettings } from '@/types/planner';
import { useAuth } from '@/contexts/AuthContext';
import catOrange from '@/assets/cat-orange.png';
import catGray from '@/assets/cat-gray.png';
import catCalico from '@/assets/cat-calico.png';
import plant from '@/assets/plant.png';

interface Props {
  view: PlannerView;
  onViewChange: (v: PlannerView) => void;
  settings: PlannerSettings;
  onUpdateSettings: (settings: PlannerSettings) => void;
}

export function PlannerHeader({ view, onViewChange, settings, onUpdateSettings }: Props) {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState(settings);

  useEffect(() => {
    if (!isEditing && settings) {
      setEditState(settings);
    }
  }, [settings, isEditing]);

  const handleSave = () => {
    onUpdateSettings(editState);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditState(settings);
    setIsEditing(false);
  };

  return (
    <header className="relative pt-4 pb-2 px-4 overflow-hidden">

      {/* Top action buttons — left side only, plant stays clear on right */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-xl shadow-soft text-muted-foreground hover:text-destructive transition-colors text-xs font-bold font-body"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Log out</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(true)}
          title="Edit titles"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-xl shadow-soft text-muted-foreground hover:text-primary transition-colors text-xs font-bold font-body"
        >
          <Pencil size={14} />
          <span className="hidden md:inline">Edit</span>
        </motion.button>
      </div>

      {/* Plant stays clean on the right with no overlap */}
      <img
        src={plant}
        alt=""
        className="absolute top-2 right-3 w-14 h-14 md:w-18 md:h-18 opacity-85 pointer-events-none"
        loading="lazy"
      />

      {/* Decorative cats */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src={catOrange} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
        <img src={catGray} alt="" className="w-12 h-12 md:w-16 md:h-16" />
        <img src={catCalico} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
      </div>

      {/* Title / Edit panel */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mb-3 max-w-sm bg-card border border-primary/20 rounded-2xl shadow-soft overflow-hidden"
          >
            {/* Edit header */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-primary/10 border-b border-primary/10">
              <span className="font-bold text-xs text-primary font-body tracking-wide uppercase">✏️ Customize Titles</span>
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancel}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-1 rounded-lg text-white bg-primary hover:bg-primary/80 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="px-4 py-3 space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 block mb-0.5">Main Title</label>
                <input
                  type="text"
                  value={editState.title}
                  onChange={e => setEditState(s => ({ ...s, title: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 block mb-0.5">Subtitle</label>
                <input
                  type="text"
                  value={editState.subtitle}
                  onChange={e => setEditState(s => ({ ...s, subtitle: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 block mb-0.5">Tab 1</label>
                  <input
                    type="text"
                    value={editState.myTab}
                    onChange={e => setEditState(s => ({ ...s, myTab: e.target.value }))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 block mb-0.5">Tab 2</label>
                  <input
                    type="text"
                    value={editState.partnerTab}
                    onChange={e => setEditState(s => ({ ...s, partnerTab: e.target.value }))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center mb-3"
          >
            <h1 className="text-3xl md:text-4xl font-handwritten text-primary font-bold tracking-wide">
              {settings?.title || 'Weekly Planner'}
            </h1>
            <p
              className="text-xs font-handwritten text-muted-foreground mt-0.5"
              dangerouslySetInnerHTML={{ __html: settings?.subtitle || 'Of my MadOm 🎀' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="relative z-10 whitespace-nowrap">
                {v === 'my' ? (settings?.myTab || '💕 My Routine') : (settings?.partnerTab || '💝 Partner')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
