import React from 'react';
import { Task } from '../types';
import { Trash2, Check, Clock, Mail, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.completed;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`
        group flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-200
        ${task.completed 
            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-75' 
            : isOverdue
              ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md hover:border-red-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900'
        }
    `}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task.id)}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200
            ${task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : isOverdue
                  ? 'border-red-300 dark:border-red-500/50 text-transparent hover:border-red-500'
                  : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500 dark:hover:border-indigo-400'
            }
          `}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>
        
        <div className="flex flex-col min-w-0 w-full mr-4">
            <div className="flex items-center justify-between">
                <span className={`
                    font-medium text-base truncate transition-all duration-200
                    ${task.completed 
                        ? 'text-slate-500 dark:text-slate-500 line-through decoration-slate-400' 
                        : isOverdue ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'
                    }
                `}>
                    {task.title}
                </span>
                
                {isOverdue && (
                  <div className="flex items-center text-xs font-medium text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {task.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500/80' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                    </span>
                )}
                
                {task.assigneeEmail && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {task.assigneeEmail}
                    </span>
                )}
            </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="
            p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg 
            opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100
        "
        aria-label="Delete task"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TaskItem;