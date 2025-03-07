
import React, { useState, useCallback } from 'react';
import { Task, TaskTableProps, Column } from '../types/table';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, type = "text" }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleDoubleClick = () => {
    setEditing(true);
    setTempValue(value);
  };

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        className="w-full px-2 py-1 rounded border border-blue-500 focus:outline-none"
        autoFocus
      />
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="cursor-text">
      {value}
    </div>
  );
};

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

interface ExtendedTaskTableProps extends TaskTableProps {
  columns: Column[];
  onColumnUpdate?: (columns: Column[]) => void;
}

const TaskTable: React.FC<ExtendedTaskTableProps> = ({ 
  tasks, 
  level = 0, 
  columns,
  onColumnUpdate 
}) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(localTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalTasks(items);
  };

  const handleUpdateField = useCallback((taskId: string, field: keyof Task | string, value: string) => {
    setLocalTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, [field]: typeof task[field] === 'object' && Array.isArray(task[field]) ? [value] : value }
          : task
      )
    );
  }, []);

  const handleAddColumn = () => {
    if (onColumnUpdate) {
      const newColumnId = `col-${Date.now()}`;
      const newColumn: Column = {
        id: newColumnId,
        title: 'New Column',
        field: newColumnId as keyof Task,
        width: 150
      };
      onColumnUpdate([...columns, newColumn]);
    }
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      tags: [],
      status: 'NOT_STARTED',
      subTasks: []
    };
    setLocalTasks([...localTasks, newTask]);
  };

  const handleAddSubTask = (parentId: string) => {
    const newTask: Task = {
      id: `subtask-${Date.now()}`,
      title: 'New Subtask',
      tags: [],
      status: 'NOT_STARTED'
    };

    setLocalTasks(prev => 
      prev.map(task => 
        task.id === parentId
          ? { ...task, subTasks: [...(task.subTasks || []), newTask] }
          : task
      )
    );

    // Ensure the parent task is expanded
    setExpandedTasks(prev => new Set([...prev, parentId]));
  };

  return (
    <div className="overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddTask}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={handleAddColumn}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500">
              {columns.map((column, index) => (
                <th key={column.id} className="py-3 pl-4">
                  <EditableField 
                    value={column.title}
                    onSave={(value) => {
                      if (onColumnUpdate) {
                        const newColumns = [...columns];
                        newColumns[index] = { ...newColumns[index], title: value };
                        onColumnUpdate(newColumns);
                      }
                    }}
                  />
                </th>
              ))}
              <th className="w-12"></th>
            </tr>
          </thead>
          <Droppable droppableId="tasks">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {localTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <React.Fragment>
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                          {columns.map(column => (
                            <td key={column.id} className="py-3">
                              {column.field === 'title' ? (
                                <div className="flex items-center space-x-2" style={{ paddingLeft: `${level * 2 + 1}rem` }}>
                                  {task.subTasks && task.subTasks.length > 0 && (
                                    <button 
                                      onClick={() => toggleTask(task.id)}
                                      className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
                                    >
                                      {expandedTasks.has(task.id) ? 
                                        <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                      }
                                    </button>
                                  )}
                                  <EditableField
                                    value={task.title}
                                    onSave={(value) => handleUpdateField(task.id, 'title', value)}
                                  />
                                </div>
                              ) : column.field === 'status' ? (
                                <StatusBadge status={task.status} />
                              ) : column.field === 'tags' ? (
                                <div className="flex flex-wrap gap-1">
                                  {task.tags.map((tag, index) => (
                                    <TagBadge key={index} tag={tag} />
                                  ))}
                                </div>
                              ) : (
                                <EditableField
                                  value={task[column.field]?.toString() || ''}
                                  onSave={(value) => handleUpdateField(task.id, column.field, value)}
                                  type={column.field.includes('date') ? 'date' : 'text'}
                                />
                              )}
                            </td>
                          ))}
                          <td className="py-3 pr-4">
                            <button
                              onClick={() => handleAddSubTask(task.id)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
                            >
                              <Plus className="w-4 h-4 text-gray-500" />
                            </button>
                          </td>
                        </tr>
                        {task.subTasks && expandedTasks.has(task.id) && (
                          <TaskTable 
                            tasks={task.subTasks} 
                            level={level + 1}
                            columns={columns}
                            onColumnUpdate={onColumnUpdate}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  );
};

export default TaskTable;
