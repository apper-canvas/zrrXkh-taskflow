import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, subMonths, isWithinInterval, parseISO, endOfDay, endOfWeek, endOfMonth } from 'date-fns'
import { CalendarDays, Calendar, CalendarRange, Plus, ArrowRight, BarChart4, PieChart, ActivitySquare, LineChart, CircleCheck, Info, AlertCircle, Clock } from 'lucide-react'
import DateRangeSelector from '../components/analytics/DateRangeSelector'
import TaskCompletionChart from '../components/analytics/TaskCompletionChart'
import CategoryDistributionChart from '../components/analytics/CategoryDistributionChart'
import PriorityBreakdownChart from '../components/analytics/PriorityBreakdownChart'
import TaskSummaryCards from '../components/analytics/TaskSummaryCards'
import ProductivityTrendChart from '../components/analytics/ProductivityTrendChart'

// Categories data - same as in Home.jsx
const categories = [
  { id: 'all', name: 'All Tasks', color: '#6366f1', icon: BarChart4 },
  { id: 'work', name: 'Work', color: '#f43f5e', icon: BarChart4 },
  { id: 'personal', name: 'Personal', color: '#14b8a6', icon: CircleCheck },
  { id: 'health', name: 'Health', color: '#8b5cf6', icon: Calendar }
]

function Analytics() {
  const [tasks, setTasks] = useState([])
  const [dateRangeType, setDateRangeType] = useState('week') // 'day', 'week', 'month', 'custom'
  const [customDateRange, setCustomDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  })

  // Fetch tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Calculate date range based on selected type
  const dateRange = useMemo(() => {
    const today = new Date()
    
    switch (dateRangeType) {
      case 'day':
        return {
          start: startOfDay(today),
          end: endOfDay(today),
          label: format(today, 'MMMM d, yyyy')
        }
      case 'week':
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 }),
          label: `Week of ${format(startOfWeek(today, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(today, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
        }
      case 'month':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
          label: format(today, 'MMMM yyyy')
        }
      case 'custom':
        return {
          start: parseISO(customDateRange.start),
          end: endOfDay(parseISO(customDateRange.end)),
          label: `${format(parseISO(customDateRange.start), 'MMM d, yyyy')} - ${format(parseISO(customDateRange.end), 'MMM d, yyyy')}`
        }
      default:
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 }),
          label: `Week of ${format(startOfWeek(today, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(today, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
        }
    }
  }, [dateRangeType, customDateRange])

  // Filter tasks based on selected date range
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.dueDate)
      return isWithinInterval(taskDate, {
        start: dateRange.start,
        end: dateRange.end
      })
    })
  }, [tasks, dateRange])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Task Analytics</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Analyze your task performance and trends over time.
        </p>
      </div>

      <DateRangeSelector 
        dateRangeType={dateRangeType}
        setDateRangeType={setDateRangeType}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        currentRangeLabel={dateRange.label}
      />

      <TaskSummaryCards tasks={filteredTasks} dateRange={dateRange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TaskCompletionChart 
          tasks={filteredTasks} 
          dateRange={dateRange} 
          dateRangeType={dateRangeType}
        />
        <ProductivityTrendChart 
          tasks={filteredTasks} 
          dateRange={dateRange}
          dateRangeType={dateRangeType}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CategoryDistributionChart 
          tasks={filteredTasks} 
          categories={categories} 
        />
        <PriorityBreakdownChart 
          tasks={filteredTasks} 
        />
      </div>

      <div className="mt-6 neu-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Task List</h2>
          <span className="text-sm text-surface-500 dark:text-surface-400">
            {filteredTasks.length} tasks in this time period
          </span>
        </div>
        
        {filteredTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="py-2 px-4 text-left">Task</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Priority</th>
                  <th className="py-2 px-4 text-left">Due Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const category = categories.find(c => c.id === task.categoryId) || categories[0];
                  return (
                    <tr key={task.id} className="border-b border-surface-200 dark:border-surface-700">
                      <td className="py-2 px-4">{task.title}</td>
                      <td className="py-2 px-4">
                        <span className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          ></span>
                          {category.name}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4">{format(parseISO(task.dueDate), 'MMM d, yyyy')}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.completed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300'
                        }`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500 dark:text-surface-400">
            <Info size={40} className="mx-auto mb-2 opacity-50" />
            <p>No tasks found in the selected time period.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Analytics