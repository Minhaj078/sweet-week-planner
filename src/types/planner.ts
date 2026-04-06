export type TaskStatus = 'pending' | 'completed' | 'missed';

export interface PlannerTask {
  text: string;
  status: TaskStatus;
}

export type WeeklyData = Record<string, Record<string, PlannerTask>>;

export interface UserPlanner {
  timeSlots: string[];
  week: WeeklyData;
}

export interface PlannerSettings {
  title: string;
  subtitle: string;
  myTab: string;
  partnerTab: string;
}

export interface AppState {
  my: UserPlanner;
  partner: UserPlanner;
  settings: PlannerSettings;
}

export type PlannerView = 'my' | 'partner';

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
