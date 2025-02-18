
import React, { useState } from 'react';
import { Task, TaskTableProps } from '../types/table';
import { ChevronRight, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status }: { status: Task['status'] }) => {
  const colors = {
    NOT_STARTED: 'bg-gray-200 text-gray-700',
    STARTED: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const TagBadge = ({ tag }: { tag: string }) => (
  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 mr-1">
    {tag}
  </span>
);

const TaskRow = ({ task, level = 0, onToggle }: { task: Task; level?: number; onToggle: (id: string) => void }) => {
  const paddingLeft = `${level * 2 + 1}rem`;

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-3" style={{ paddingLeft }}>
        <div className="flex items-center space-x-2">
          {task.subTasks && task.subTasks.length > 0 && (
            <button 
              onClick={() => onToggle(task.id)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
            >
              {task.isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </button>
          )}
          <span className="font-medium text-gray-900">{task.title}</span>
          {task.subCount && (
            <span className="text-xs text-gray-500">{task.subCount} subs</span>
          )}
        </div>
      </td>
      <td className="py-3">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <TagBadge key={index} tag={tag} />
          ))}
        </div>
      </td>
      <td className="py-3">
        {task.assignee && (
          <span className="text-sm text-gray-600">{task.assignee}</span>
        )}
      </td>
      <td className="py-3">
        <StatusBadge status={task.status} />
      </td>
      <td className="py-3">
        {task.startDate && (
          <span className="text-sm text-gray-600">{task.startDate}</span>
        )}
      </td>
      <td className="py-3">
        {task.dueDate && (
          <span className="text-sm text-gray-600">{task.dueDate}</span>
        )}
      </td>
    </tr>
  );
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, level = 0 }) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th className="py-3 pl-4">ITEM</th>
            <th className="py-3">TAGS</th>
            <th className="py-3">ASSIGNEES</th>
            <th className="py-3">STATUS</th>
            <th className="py-3">START DATE</th>
            <th className="py-3">DUE DATE</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <TaskRow 
                task={{ ...task, isExpanded: expandedTasks.has(task.id) }} 
                level={level} 
                onToggle={toggleTask}
              />
              {task.subTasks && expandedTasks.has(task.id) && (
                <TaskTable tasks={task.subTasks} level={level + 1} />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
