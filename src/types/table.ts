
export interface Task {
  id: string;
  title: string;
  subTasks?: Task[];
  tags: string[];
  assignee?: string;
  status: 'NOT_STARTED' | 'STARTED' | 'COMPLETED';
  startDate?: string;
  dueDate?: string;
  subCount?: number;
  isExpanded?: boolean;
  [key: string]: any; // Allow dynamic fields
}

export interface TaskTableProps {
  tasks: Task[];
  level?: number;
}

export interface Column {
  id: string;
  title: string;
  field: keyof Task;
  width?: number;
}
