export interface Home {
  id: string;
  name: string;
  address: string;
}

export type TaskType = 'recurring' | 'renovation';

export interface MaintenanceTask {
  id: string;
  homeId: string;
  title: string;
  type: TaskType;
  frequency?: 'monthly' | 'yearly' | 'seasonal';
  isCompleted: boolean;
}