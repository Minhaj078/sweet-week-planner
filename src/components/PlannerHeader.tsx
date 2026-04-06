import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, Check, X } from 'lucide-react';
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
      {/* Decorative cats in header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src={catOrange} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
        <img src={catGray} alt="" className="w-12 h-12 md:w-16 md:h-16" />
        <img src={catCalico} alt="" className="w-10 h-10 md:w-14 md:h-14" loading="lazy" />
      </div>

      <button onClick={logout} className="absolute top-4 left-4 p-2 bg-card rounded-xl shadow-soft text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors z-20">
         <LogOut size={16} />
         <span className="text-xs font-bold font-body hidden md:inline">Log out</span>
      </button>

      {/* Edit button */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={() => setIsEditing(true)} className="p-2 bg-card rounded-xl shadow-soft text-muted-foreground hover:text-primary transition-colors">
          <Settings size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-3 bg-card p-4 rounded-2xl shadow-soft max-w-md mx-auto"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-primary">Edit Titles</h3>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="p-1 text-muted-foreground hover:bg-muted rounded"><X size={16} /></button>
                <button onClick={handleSave} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check size={16} /></button>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs font-bold text-muted-foreground ml-1">Main Title</label>
                <input 
                   type="text" 
                   value={editState.title} 
                   onChange={e => setEditState(s => ({...s, title: e.target.value}))}
                   className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground ml-1">Subtitle</label>
                <input 
                   type="text" 
                   value={editState.subtitle} 
                   onChange={e => setEditState(s => ({...s, subtitle: e.target.value}))}
                   className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground ml-1">Tab 1</label>
                  <input 
                     type="text" 
                     value={editState.myTab} 
                     onChange={e => setEditState(s => ({...s, myTab: e.target.value}))}
                     className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground ml-1">Tab 2</label>
                  <input 
                     type="text" 
                     value={editState.partnerTab} 
                     onChange={e => setEditState(s => ({...s, partnerTab: e.target.value}))}
                     className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-handwritten focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-3"
          >
            <h1 className="text-3xl md:text-4xl font-handwritten text-primary font-bold tracking-wide">
              {settings?.title || "Weekly Planner"}
            </h1>
            <p className="text-xs font-handwritten text-muted-foreground mt-0.5" dangerouslySetInnerHTML={{ __html: settings?.subtitle || "Of my MadOm 🎀" }} />
          </motion.div>
        )}
      </AnimatePresence>

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
