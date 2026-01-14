export type ThemeMode = 'elegant' | 'warm';

export type MainCheckInType = 'morning' | 'sleep' | 'work';

export type CheckInFrequency = 'daily' | 'weekly' | 'custom';

export interface WorkTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface CustomCheckIn {
  id: string;
  name: string;
  icon: 'spark' | 'book' | 'heart' | 'cup' | 'droplet';
  frequency: CheckInFrequency;
  completedToday: boolean;
  checkedInAt?: string;
  note?: string;
  streak: number;
  history: string[];
}

export interface MorningState {
  checkedIn: boolean;
  checkedInAt?: string;
  history: string[];
}

export interface SleepEntry {
  date: string;
  durationMinutes: number;
  sleepTime: string;
  wakeTime: string;
}

export interface SleepState {
  sleepAt?: string;
  wakeAt?: string;
  durationMinutes?: number;
  last7Days: SleepEntry[];
}

export interface WorkState {
  tasks: WorkTask[];
  checkedIn: boolean;
  checkedInAt?: string;
  completionRate: number;
  incompleteReasons: string[];
}

export interface AppSettings {
  morningReminder: string;
  sleepReminder: string;
  workReminder: string;
  hideStats: boolean;
  autoBackup: boolean;
}

export interface AppState {
  lastActiveDate: string;
  theme: ThemeMode;
  morning: MorningState;
  sleep: SleepState;
  work: WorkState;
  checkInOrder: string[];
  customCheckIns: CustomCheckIn[];
  settings: AppSettings;
  user: {
    name: string;
    avatar: string;
  };
}
