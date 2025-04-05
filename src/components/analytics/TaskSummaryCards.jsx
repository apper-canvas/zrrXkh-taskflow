import { useMemo } from 'react'
import { parseISO, isPast, isToday, addDays } from 'date-fns'
import { CheckCircle2, AlertTriangle, Clock, Calendar } from 'lucide-react'

function TaskSummaryCards({ tasks, dateRange }) {
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const overdue = tasks.filter(task => {
      const dueDate = parseISO(task.dueDate);
      return !task.completed && isPast(dueDate) && !isToday(dueDate);
    }).length;
    
    const upcoming = tasks.filter(task => {
      const dueDate = parseISO(task.dueDate);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return !task.completed && dueDate >= today && dueDate <= nextWeek;
    }).length;
    
    const highPriority = tasks.filter(task => 
      task.priority === 'high' && !task.completed
    ).length;
    
    return {
      total,
      completed,
      completionRate,
      overdue,
      upcoming,
      highPriority
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="analytics-card">
        <div className="flex">
          <div className="flex-1">
            <span className="text-sm text-surface-500 dark:text-surface-400 block mb-1">Tasks Completed</span>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{taskStats.completed}</span>
              <span className="text-surface-500 dark:text-surface-400 ml-1 text-sm">/ {taskStats.total}</span>
            </div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 h-12 w-12 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${taskStats.completionRate}%` }}
            ></div>
          </div>
          <div className="text-xs mt-1 text-surface-500 dark:text-surface-400">
            {taskStats.completionRate}% completion rate
          </div>
        </div>
      </div>
      
      <div className="analytics-card">
        <div className="flex">
          <div className="flex-1">
            <span className="text-sm text-surface-500 dark:text-surface-400 block mb-1">Overdue Tasks</span>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{taskStats.overdue}</span>
              <span className="text-surface-500 dark:text-surface-400 ml-1 text-sm">tasks</span>
            </div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 h-12 w-12 rounded-lg flex items-center justify-center">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="text-xs text-surface-500 dark:text-surface-400">
            {taskStats.overdue > 0 ? (
              <span className="text-red-500 dark:text-red-400">Requires attention!</span>
            ) : (
              <span className="text-green-500 dark:text-green-400">No overdue tasks!</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="analytics-card">
        <div className="flex">
          <div className="flex-1">
            <span className="text-sm text-surface-500 dark:text-surface-400 block mb-1">High Priority</span>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{taskStats.highPriority}</span>
              <span className="text-surface-500 dark:text-surface-400 ml-1 text-sm">tasks</span>
            </div>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 h-12 w-12 rounded-lg flex items-center justify-center">
            <Clock className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="text-xs text-surface-500 dark:text-surface-400">
            {taskStats.highPriority > 0 ? (
              <span>Focus on high priority tasks first</span>
            ) : (
              <span className="text-green-500 dark:text-green-400">No high priority tasks!</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="analytics-card">
        <div className="flex">
          <div className="flex-1">
            <span className="text-sm text-surface-500 dark:text-surface-400 block mb-1">Upcoming Tasks</span>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{taskStats.upcoming}</span>
              <span className="text-surface-500 dark:text-surface-400 ml-1 text-sm">in 7 days</span>
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 rounded-lg flex items-center justify-center">
            <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="text-xs text-surface-500 dark:text-surface-400">
            Plan ahead for the upcoming tasks
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskSummaryCards