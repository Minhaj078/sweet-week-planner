import { useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppState, PlannerView, TaskStatus, PlannerSettings } from '@/types/planner';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const socket: Socket = io(API_URL, { autoConnect: false });

const INITIAL_STATE: AppState = {
  my: { timeSlots: [], week: { Sunday: {}, Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {} } },
  partner: { timeSlots: [], week: { Sunday: {}, Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {} } },
  settings: {
    title: "Weekly Planner",
    subtitle: "Of my MadOm 🎀 Content creator",
    myTab: "💕 My Routine",
    partnerTab: "💝 Partner"
  }
};

export function usePlannerState() {
  const [view, setView] = useState<PlannerView>('my');
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect_error', (err) => {
        console.error('Socket connect error:', err.message);
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('initial-state', (state: AppState) => {
      setAppState(state);
    });

    socket.on('state-changed', (data: { user: PlannerView, type: string, payload: any }) => {
      setAppState(prev => {
        const newState = { ...prev };
        
        if (data.type === 'update-settings') {
          newState.settings = data.payload;
          return newState;
        }

        const userState = { ...newState[data.user], week: { ...newState[data.user].week } };

        if (data.type === 'update-task') {
          const { day, time, task } = data.payload;
          userState.week[day] = { ...userState.week[day] };
          if (task === null) {
            delete userState.week[day][time];
          } else {
            userState.week[day][time] = task;
          }
        } else if (data.type === 'add-slot') {
          if (!userState.timeSlots.includes(data.payload.time)) {
            userState.timeSlots = [...userState.timeSlots, data.payload.time];
          }
        } else if (data.type === 'remove-slot') {
          userState.timeSlots = userState.timeSlots.filter(t => t !== data.payload.time);
          for (const day in userState.week) {
             const newDay = { ...userState.week[day] };
             delete newDay[data.payload.time];
             userState.week[day] = newDay;
          }
        }

        newState[data.user] = userState;
        return newState;
      });
    });

    const token = localStorage.getItem('planner_token');
    if (token) {
      const auth = socket.auth as { token?: string };
      if (socket.connected && auth?.token !== token) {
        socket.disconnect();
      }
      
      if (!socket.connected) {
        socket.auth = { token };
        socket.connect();
      }
    }

    return () => {
      socket.off('connect_error');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initial-state');
      socket.off('state-changed');
    };
  }, []);

  const addTimeSlot = useCallback((time: string) => {
    socket.emit('db-action', { user: view, type: 'add-slot', payload: { time } });
    setAppState(prev => {
      if (prev[view].timeSlots.includes(time)) return prev;
      return {
        ...prev,
        [view]: { ...prev[view], timeSlots: [...prev[view].timeSlots, time] }
      };
    });
  }, [view]);

  const removeTimeSlot = useCallback((time: string) => {
    socket.emit('db-action', { user: view, type: 'remove-slot', payload: { time } });
    setAppState(prev => {
      const nb = { ...prev };
      const u = { ...nb[view], week: { ...nb[view].week } };
      u.timeSlots = u.timeSlots.filter(t => t !== time);
      for (const day in u.week) {
         const newDay = { ...u.week[day] };
         delete newDay[time];
         u.week[day] = newDay;
      }
      nb[view] = u;
      return nb;
    });
  }, [view]);

  const setTask = useCallback((day: string, time: string, text: string) => {
    const task = !text.trim() ? null : { text, status: 'pending' as TaskStatus };
    socket.emit('db-action', { user: view, type: 'update-task', payload: { day, time, task } });
    
    setAppState(prev => {
      const nb = { ...prev };
      const updatedWeek = { ...nb[view].week };
      const updatedDay = { ...updatedWeek[day] };
      if (!task) delete updatedDay[time]; else updatedDay[time] = task;
      updatedWeek[day] = updatedDay;
      nb[view] = { ...nb[view], week: updatedWeek };
      return nb;
    });
  }, [view]);

  const cycleStatus = useCallback((day: string, time: string) => {
    setAppState(prev => {
      const task = prev[view].week[day]?.[time];
      if (!task) return prev;
      
      const order: TaskStatus[] = ['pending', 'completed', 'missed'];
      const next = order[(order.indexOf(task.status) + 1) % 3];
      
      const newTask = { ...task, status: next };
      socket.emit('db-action', { user: view, type: 'update-task', payload: { day, time, task: newTask } });

      const nb = { ...prev };
      const updatedWeek = { ...nb[view].week };
      updatedWeek[day] = { ...updatedWeek[day], [time]: newTask };
      nb[view] = { ...nb[view], week: updatedWeek };
      return nb;
    });
  }, [view]);

  const updateSettings = useCallback((settings: PlannerSettings) => {
    socket.emit('db-action', { user: view, type: 'update-settings', payload: settings });
    setAppState(prev => ({ ...prev, settings }));
  }, [view]);

  return { 
    view, setView, cycleStatus, setTask, addTimeSlot, removeTimeSlot, updateSettings,
    settings: appState.settings,
    slots: appState[view].timeSlots,
    getDayData: (day: string) => appState[view].week[day] || {},
    isConnected 
  };
}
