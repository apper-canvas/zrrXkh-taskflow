import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, parseISO, isEqual, startOfDay, getMonth, isSameDay, isSameMonth } from 'date-fns'
import { BarChart4 } from 'lucide-react'

function TaskCompletionChart({ tasks, dateRange, dateRangeType }) {
  // Generate date intervals based on the dateRangeType
  const intervals = useMemo(() => {
    switch(dateRangeType) {
      case 'day':
        // For day view, we'll show hours
        return Array.from({ length: 24 }, (_, i) => {
          const date = new Date(dateRange.start);
          date.setHours(i, 0, 0, 0);
          return date;
        });
      case 'week':
        return eachDayOfInterval({
          start: dateRange.start,
          end: dateRange.end
        });
      case 'month':
        return eachDayOfInterval({
          start: dateRange.start,
          end: dateRange.end
        });
      case 'custom':
        // For custom ranges up to 30 days, show days
        // For larger ranges, show weeks or months
        const dayDiff = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
        
        if (dayDiff <= 30) {
          return eachDayOfInterval({
            start: dateRange.start,
            end: dateRange.end
          });
        } else if (dayDiff <= 90) {
          return eachWeekOfInterval({
            start: dateRange.start,
            end: dateRange.end
          });
        } else {
          return eachMonthOfInterval({
            start: dateRange.start,
            end: dateRange.end
          });
        }
      default:
        return eachDayOfInterval({
          start: dateRange.start,
          end: dateRange.end
        });
    }
  }, [dateRange, dateRangeType]);

  // Process task data for the chart
  const chartData = useMemo(() => {
    // Initialize completion data for each interval
    const completionData = intervals.map(date => {
      return {
        date,
        total: 0,
        completed: 0
      };
    });

    // Populate with actual task data
    tasks.forEach(task => {
      const taskDate = parseISO(task.dueDate);
      
      let intervalIndex = -1;
      
      if (dateRangeType === 'day') {
        // For day view, find the hour
        intervalIndex = completionData.findIndex(item => 
          item.date.getHours() === taskDate.getHours()
        );
      } else if (dateRangeType === 'custom') {
        const dayDiff = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
        
        if (dayDiff <= 30) {
          // Find the matching day
          intervalIndex = completionData.findIndex(item => 
            isSameDay(item.date, taskDate)
          );
        } else if (dayDiff <= 90) {
          // Find the matching week
          intervalIndex = completionData.findIndex(item => {
            const itemWeekStart = item.date;
            const itemWeekEnd = new Date(item.date);
            itemWeekEnd.setDate(itemWeekEnd.getDate() + 6);
            
            return taskDate >= itemWeekStart && taskDate <= itemWeekEnd;
          });
        } else {
          // Find the matching month
          intervalIndex = completionData.findIndex(item => 
            isSameMonth(item.date, taskDate)
          );
        }
      } else {
        // For week and month views, find the matching day
        intervalIndex = completionData.findIndex(item => 
          isSameDay(item.date, taskDate)
        );
      }
      
      if (intervalIndex !== -1) {
        completionData[intervalIndex].total += 1;
        if (task.completed) {
          completionData[intervalIndex].completed += 1;
        }
      }
    });

    return completionData;
  }, [tasks, intervals, dateRangeType, dateRange]);

  // Format labels based on the dateRangeType
  const labels = useMemo(() => {
    return chartData.map(item => {
      if (dateRangeType === 'day') {
        return format(item.date, 'ha'); // Hour with am/pm
      } else if (dateRangeType === 'custom') {
        const dayDiff = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
        
        if (dayDiff <= 30) {
          return format(item.date, 'MMM d');
        } else if (dayDiff <= 90) {
          return format(item.date, 'MMM d');
        } else {
          return format(item.date, 'MMM yyyy');
        }
      } else if (dateRangeType === 'week') {
        return format(item.date, 'EEE'); // Day of week
      } else {
        return format(item.date, 'd'); // Day of month
      }
    });
  }, [chartData, dateRangeType, dateRange]);

  const series = [
    {
      name: 'Completed Tasks',
      data: chartData.map(item => item.completed)
    },
    {
      name: 'Total Tasks',
      data: chartData.map(item => item.total)
    }
  ];

  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    colors: ['#10b981', '#6366f1'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e5e7eb',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          cssClass: 'text-sm text-surface-600'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Tasks'
      },
      min: 0,
      labels: {
        style: {
          cssClass: 'text-sm text-surface-600'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return value + " tasks";
        }
      }
    },
    theme: {
      mode: 'light'
    }
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <BarChart4 size={20} className="mr-2 text-primary" />
        Task Completion Over Time
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Track your task completion patterns over the selected time period.
      </p>
      <div>
        <Chart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  )
}

export default TaskCompletionChart