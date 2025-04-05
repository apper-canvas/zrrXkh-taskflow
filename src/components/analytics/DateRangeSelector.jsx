import { useState } from 'react'
import { CalendarDays, Calendar, CalendarRange, Filter } from 'lucide-react'

function DateRangeSelector({ 
  dateRangeType, 
  setDateRangeType, 
  customDateRange, 
  setCustomDateRange,
  currentRangeLabel
}) {
  const [showCustomControls, setShowCustomControls] = useState(false)

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target
    setCustomDateRange(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTabChange = (type) => {
    setDateRangeType(type)
    if (type === 'custom') {
      setShowCustomControls(true)
    } else {
      setShowCustomControls(false)
    }
  }

  return (
    <div className="neu-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Date Range</h2>
        <span className="text-surface-500 dark:text-surface-400 text-sm">{currentRangeLabel}</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          className={`date-range-tab ${dateRangeType === 'day' ? 'active' : ''}`}
          onClick={() => handleTabChange('day')}
        >
          <Calendar size={16} className="inline mr-1" />
          Today
        </button>
        
        <button 
          className={`date-range-tab ${dateRangeType === 'week' ? 'active' : ''}`}
          onClick={() => handleTabChange('week')}
        >
          <CalendarDays size={16} className="inline mr-1" />
          This Week
        </button>
        
        <button 
          className={`date-range-tab ${dateRangeType === 'month' ? 'active' : ''}`}
          onClick={() => handleTabChange('month')}
        >
          <CalendarRange size={16} className="inline mr-1" />
          This Month
        </button>
        
        <button 
          className={`date-range-tab ${dateRangeType === 'custom' ? 'active' : ''}`}
          onClick={() => handleTabChange('custom')}
        >
          <Filter size={16} className="inline mr-1" />
          Custom Range
        </button>
      </div>
      
      {showCustomControls && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="start"
              value={customDateRange.start}
              onChange={handleCustomDateChange}
              className="w-full p-2 border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end"
              value={customDateRange.end}
              onChange={handleCustomDateChange}
              className="w-full p-2 border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeSelector