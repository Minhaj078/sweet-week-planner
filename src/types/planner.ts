export type TaskStatus = 'pending' | 'completed' | 'missed';

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
}

export interface PlannerTask {
  timeSlotId: string;
  day: number;
  text: string;
  status: TaskStatus;
}

export type PlannerView = 'my' | 'partner';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
