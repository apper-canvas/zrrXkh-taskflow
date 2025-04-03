import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Plus, 
  X, 
  Calendar, 
  Flag, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

function MainFeature({ tasks, onToggleCompletion, onDeleteTask, onAddTask, categories }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    categoryId: categories[0]?.id || 'work'
  })
  const [formErrors, setFormErrors] = useState({})

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!newTask.title.trim()) {
      errors.title = "Task title is required"
    }
    
    if (!newTask.dueDate) {
      errors.dueDate = "Due date is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
      completed: false
    }
    
    onAddTask(taskToAdd)
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      categoryId: categories[0]?.id || 'work'
    })
    
    setIsFormOpen(false)
  }

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-accent" />
      case 'medium':
        return <Flag size={16} className="text-primary" />
      case 'low':
        return <Clock size={16} className="text-secondary" />
      default:
        return <Flag size={16} className="text-primary" />
    }
  }

  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#6366f1'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Add Task
        </button>
      </div>
      
      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-soft max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Task Title <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className={`input ${formErrors.title ? 'border-accent' : ''}`}
                      placeholder="What needs to be done?"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-accent">{formErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                      className="input min-h-[80px]"
                      placeholder="Add details about this task..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                        Due Date <span className="text-accent">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        className={`input ${formErrors.dueDate ? 'border-accent' : ''}`}
                      />
                      {formErrors.dueDate && (
                        <p className="mt-1 text-sm text-accent">{formErrors.dueDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={newTask.categoryId}
                      onChange={handleInputChange}
                      className="input"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task List */}
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-surface-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            You don't have any tasks in this category or with the selected filter.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary mx-auto"
          >
            <Plus size={18} className="mr-2" />
            Add Your First Task
          </button>
        </motion.div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`card p-4 task-priority-${task.priority} ${
                  task.completed ? 'bg-surface-50/50 dark:bg-surface-800/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleCompletion(task.id)}
                    className="mt-1 flex-shrink-0 text-surface-400 hover:text-primary transition-colors"
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? (
                      <CheckCircle size={22} className="text-secondary" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${
                        task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${getCategoryColor(task.categoryId)}20`,
                          color: getCategoryColor(task.categoryId)
                        }}
                      >
                        {categories.find(c => c.id === task.categoryId)?.name || 'Category'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm text-surface-600 dark:text-surface-400 mb-2 ${
                        task.completed ? 'text-surface-400 dark:text-surface-500' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-surface-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center">
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="flex-shrink-0 p-1.5 text-surface-400 hover:text-accent rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

export default MainFeature