import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlannerHeader } from '@/components/PlannerHeader';
import { WeeklyGrid } from '@/components/WeeklyGrid';
import { AddTimeSlotModal } from '@/components/AddTimeSlotModal';
import { usePlannerState } from '@/hooks/usePlannerState';

const Index = () => {
  const { view, setView, slots, addTimeSlot, removeTimeSlot, setTask, cycleStatus, getDayData, isConnected, settings, updateSettings } = usePlannerState();
  const [showAddSlot, setShowAddSlot] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <PlannerHeader 
        view={view} 
        onViewChange={setView} 
        settings={settings}
        onUpdateSettings={updateSettings} 
      />
      
      {!isConnected && (
         <div className="bg-red-500/20 text-red-600 text-center text-xs py-1 font-body">
           Reconnecting to server... changes will be saved locally.
         </div>
      )}

      <WeeklyGrid
        slots={slots}
        getDayData={getDayData}
        onSetTask={setTask}
        onCycleStatus={cycleStatus}
        onRemoveSlot={removeTimeSlot}
      />

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddSlot(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full shadow-soft w-14 h-14 flex items-center justify-center font-display font-bold text-sm z-40 hover:opacity-90 transition-opacity"
      >
        <Plus size={24} />
      </motion.button>

      <AddTimeSlotModal
        open={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onAdd={addTimeSlot}
      />
    </div>
  );
};

export default Index;
