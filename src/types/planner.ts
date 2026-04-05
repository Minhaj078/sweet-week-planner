export type TaskStatus = 'pending' | 'completed' | 'missed';

export interface TimeSlot {
  id: string;
  label: string;
}

export interface PlannerTask {
  timeSlotId: string;
  day: number;
  text: string;
  status: TaskStatus;
}

export type PlannerView = 'my' | 'partner';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const DEFAULT_TIME_SLOTS: Omit<TimeSlot, 'id'>[] = [
  { label: '8-10 AM' },
  { label: '10-12 PM' },
  { label: '12-1 PM' },
  { label: '1-2 PM' },
  { label: '3-4 PM' },
  { label: '4-5 PM' },
  { label: '5-6 PM' },
  { label: '6-7 PM' },
  { label: '7-9 PM' },
  { label: '9-10 PM' },
  { label: '10-11 PM' },
  { label: '11-12 AM' },
  { label: '12-1 AM' },
  { label: '1-2 AM' },
  { label: '2-3 AM' },
  { label: '3-4 AM' },
];
