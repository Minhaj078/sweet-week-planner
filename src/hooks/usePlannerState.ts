import { useState, useCallback } from 'react';
import { TimeSlot, PlannerTask, PlannerView, TaskStatus } from '@/types/planner';

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_SLOTS: TimeSlot[] = [
  { id: generateId(), label: 'Morning', startTime: '08:00', endTime: '10:00' },
  { id: generateId(), label: 'Midday', startTime: '10:00', endTime: '12:00' },
  { id: generateId(), label: 'Afternoon', startTime: '14:00', endTime: '16:00' },
  { id: generateId(), label: 'Evening', startTime: '18:00', endTime: '20:00' },
];

export function usePlannerState() {
  const [view, setView] = useState<PlannerView>('my');
  const [timeSlots, setTimeSlots] = useState<Record<PlannerView, TimeSlot[]>>({
    my: DEFAULT_SLOTS,
    partner: DEFAULT_SLOTS.map(s => ({ ...s, id: generateId() })),
  });
  const [tasks, setTasks] = useState<Record<PlannerView, PlannerTask[]>>({
    my: [],
    partner: [],
  });

  const slots = timeSlots[view];
  const currentTasks = tasks[view];

  const addTimeSlot = useCallback((label: string, startTime: string, endTime: string) => {
    const slot: TimeSlot = { id: generateId(), label, startTime, endTime };
    setTimeSlots(prev => ({ ...prev, [view]: [...prev[view], slot] }));
  }, [view]);

  const removeTimeSlot = useCallback((id: string) => {
    setTimeSlots(prev => ({ ...prev, [view]: prev[view].filter(s => s.id !== id) }));
    setTasks(prev => ({ ...prev, [view]: prev[view].filter(t => t.timeSlotId !== id) }));
  }, [view]);

  const setTask = useCallback((timeSlotId: string, day: number, text: string) => {
    setTasks(prev => {
      const filtered = prev[view].filter(t => !(t.timeSlotId === timeSlotId && t.day === day));
      if (!text.trim()) return { ...prev, [view]: filtered };
      return { ...prev, [view]: [...filtered, { timeSlotId, day, text, status: 'pending' }] };
    });
  }, [view]);

  const cycleStatus = useCallback((timeSlotId: string, day: number) => {
    setTasks(prev => {
      const updated = prev[view].map(t => {
        if (t.timeSlotId === timeSlotId && t.day === day) {
          const order: TaskStatus[] = ['pending', 'completed', 'missed'];
          const next = order[(order.indexOf(t.status) + 1) % 3];
          return { ...t, status: next };
        }
        return t;
      });
      return { ...prev, [view]: updated };
    });
  }, [view]);

  const getTask = useCallback((timeSlotId: string, day: number) => {
    return currentTasks.find(t => t.timeSlotId === timeSlotId && t.day === day);
  }, [currentTasks]);

  return { view, setView, slots, addTimeSlot, removeTimeSlot, setTask, cycleStatus, getTask };
}
