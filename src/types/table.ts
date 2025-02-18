
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
}

export interface TaskTableProps {
  tasks: Task[];
  level?: number;
}
