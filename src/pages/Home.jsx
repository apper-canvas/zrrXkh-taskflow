import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ListTodo, Calendar, BarChart4 } from 'lucide-react'
import MainFeature from '../components/MainFeature'

// Load tasks from localStorage or use default tasks
const getInitialTasks = () => {
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    return JSON.parse(savedTasks)
  }
  
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the draft and send for review',
      completed: false,
      dueDate: '2023-12-15',
      priority: 'high',
      categoryId: 'work'
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, and vegetables',
      completed: true,
      dueDate: '2023-12-10',
      priority: 'medium',
      categoryId: 'personal'
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      description: 'Call Dr. Smith for a checkup',
      completed: false,
      dueDate: '2023-12-20',
      priority: 'low',
      categoryId: 'health'
    }
  ]
}

// Categories data
const categories = [
  { id: 'all', name: 'All Tasks', color: '#6366f1', icon: ListTodo },
  { id: 'work', name: 'Work', color: '#f43f5e', icon: BarChart4 },
  { id: 'personal', name: 'Personal', color: '#14b8a6', icon: CheckCircle2 },
  { id: 'health', name: 'Health', color: '#8b5cf6', icon: Calendar }
]

function Home() {
  const [tasks, setTasks] = useState(getInitialTasks)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filter, setFilter] = useState('all') // 'all', 'completed', 'active'
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])
  
  // Filter tasks based on selected category and filter
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.categoryId === selectedCategory
    
    if (filter === 'all') return categoryMatch
    if (filter === 'completed') return categoryMatch && task.completed
    if (filter === 'active') return categoryMatch && !task.completed
    
    return categoryMatch
  })
  
  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }
  
  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }
  
  // Add a new task
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask])
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-3"
      >
        <div className="neu-card">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                      : 'hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  <category.icon 
                    size={18} 
                    style={{ color: category.color }} 
                    className="mr-2" 
                  />
                  <span>{category.name}</span>
                  <span className="ml-auto bg-surface-200 dark:bg-surface-700 text-xs rounded-full px-2 py-1">
                    {category.id === 'all' 
                      ? tasks.length 
                      : tasks.filter(task => task.categoryId === category.id).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold mb-4">Task Status</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm ${
                  filter === 'active' 
                    ? 'bg-accent text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm ${
                  filter === 'completed' 
                    ? 'bg-secondary text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-9"
      >
        <MainFeature 
          tasks={filteredTasks} 
          onToggleCompletion={toggleTaskCompletion}
          onDeleteTask={deleteTask}
          onAddTask={addTask}
          categories={categories.filter(c => c.id !== 'all')}
        />
      </motion.div>
    </div>
  )
}

export default Home