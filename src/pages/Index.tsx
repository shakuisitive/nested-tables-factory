
import React from 'react';
import TaskTable from '../components/TaskTable';
import { Task } from '../types/table';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Blog',
    tags: ['Content'],
    status: 'NOT_STARTED',
    subCount: 3,
    subTasks: [
      {
        id: '1-1',
        title: 'Social Media',
        assignee: 'Lindsey Bluthe',
        tags: ['Content'],
        status: 'STARTED',
        startDate: 'Jan 1, 2015',
        subCount: 3,
        subTasks: [
          {
            id: '1-1-1',
            title: 'Write 3 posts',
            assignee: 'Maggie Sheldon',
            tags: ['Content'],
            status: 'COMPLETED',
            startDate: 'Jan 4, 2015',
            dueDate: 'Jan 1, 2015'
          },
          {
            id: '1-1-2',
            title: 'Review & edits',
            assignee: 'Shire Henderson',
            tags: ['Content'],
            status: 'COMPLETED',
            startDate: 'Jan 10, 2015',
            dueDate: 'Jan 1, 2015'
          },
          {
            id: '1-1-3',
            title: 'Design Graphics',
            assignee: 'Shire Henderson',
            tags: ['Design'],
            status: 'STARTED',
            startDate: 'Jan 11, 2015',
            dueDate: 'Jan 1, 2015'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Landing Page',
        assignee: 'Maggie Sheldon',
        tags: ['Development'],
        status: 'STARTED',
        startDate: 'Jan 2, 2015',
        dueDate: 'Jan 15, 2015',
        subCount: 3
      },
      {
        id: '1-3',
        title: 'Webinar',
        assignee: 'Grahm Lockheed',
        tags: ['Asset'],
        status: 'STARTED',
        startDate: 'Jan 17, 2015',
        dueDate: 'Jan 16, 2015',
        subCount: 3,
        subTasks: [
          {
            id: '1-3-1',
            title: 'Script Development',
            assignee: 'Maggie Sheldon',
            tags: ['Content'],
            status: 'COMPLETED',
            dueDate: 'Jan 10, 2015'
          },
          {
            id: '1-3-2',
            title: 'Create Video',
            assignee: 'Lindsey Bluthe',
            tags: [],
            status: 'STARTED',
            dueDate: 'Jan 16, 2015'
          }
        ]
      }
    ]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mobile Website</h1>
          <div className="mt-4 flex space-x-8 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Activity
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Task Tracker
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Gantt
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Resource Planning
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Time & Expenses
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Files
            </button>
          </div>
        </div>
        <TaskTable tasks={mockTasks} />
      </div>
    </div>
  );
};

export default Index;
