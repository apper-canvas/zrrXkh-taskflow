import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { format, eachDayOfInterval, parseISO, differenceInDays, isSameDay, isSameWeek, isSameMonth } from 'date-fns'
import { LineChart } from 'lucide-react'

function ProductivityTrendChart({ tasks, dateRange, dateRangeType }) {
  // Generate appropriate intervals based on date range type
  const intervals = useMemo(() => {
    if (dateRangeType === 'day') {
      // For a single day, divide into morning, afternoon, evening
      return [
        { name: 'Morning (6am-12pm)', start: 6, end: 11 },
        { name: 'Afternoon (12pm-6pm)', start: 12, end: 17 },
        { name: 'Evening (6pm-12am)', start: 18, end: 23 },
        { name: 'Night (12am-6am)', start: 0, end: 5 }
      ];
    } else {
      return eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end
      });
    }
  }, [dateRange, dateRangeType]);

  // Calculate productivity scores for each interval
  const productivityData = useMemo(() => {
    const calculateProductivityScore = (tasksList) => {
      // Simple scoring formula:
      // Completed tasks: high priority = 5, medium = 3, low = 1
      // Pending tasks: high priority = -1, medium = -0.5, low = -0.2
      let score = 0;
      
      tasksList.forEach(task => {
        const priorityValue = task.priority === 'high' ? 5 : 
                             task.priority === 'medium' ? 3 : 1;
                             
        if (task.completed) {
          score += priorityValue;
        } else {
          score -= (priorityValue * 0.2);
        }
      });
      
      return Math.max(0, score); // Don't go below zero
    };

    if (dateRangeType === 'day') {
      // Process data for time blocks in a day
      return intervals.map(interval => {
        const tasksInInterval = tasks.filter(task => {
          const taskDate = parseISO(task.dueDate);
          const taskHour = taskDate.getHours();
          return taskHour >= interval.start && taskHour <= interval.end;
        });
        
        return {
          name: interval.name,
          score: calculateProductivityScore(tasksInInterval)
        };
      });
    } else {
      // Process data for days
      return intervals.map(date => {
        let relevantTasks = [];
        
        if (dateRangeType === 'week' || dateRangeType === 'month') {
          relevantTasks = tasks.filter(task => {
            const taskDate = parseISO(task.dueDate);
            return isSameDay(taskDate, date);
          });
        } else if (dateRangeType === 'custom') {
          const dayDiff = differenceInDays(dateRange.end, dateRange.start);
          
          if (dayDiff <= 30) {
            relevantTasks = tasks.filter(task => {
              const taskDate = parseISO(task.dueDate);
              return isSameDay(taskDate, date);
            });
          } else if (dayDiff <= 90) {
            relevantTasks = tasks.filter(task => {
              const taskDate = parseISO(task.dueDate);
              return isSameWeek(taskDate, date, { weekStartsOn: 1 });
            });
          } else {
            relevantTasks = tasks.filter(task => {
              const taskDate = parseISO(task.dueDate);
              return isSameMonth(taskDate, date);
            });
          }
        }
        
        return {
          date,
          score: calculateProductivityScore(relevantTasks)
        };
      });
    }
  }, [tasks, intervals, dateRangeType, dateRange]);

  // Format category labels based on the date range type
  const categories = useMemo(() => {
    if (dateRangeType === 'day') {
      return productivityData.map(item => item.name);
    } else if (dateRangeType === 'week') {
      return productivityData.map(item => format(item.date, 'EEE'));
    } else if (dateRangeType === 'month') {
      return productivityData.map(item => format(item.date, 'd'));
    } else {
      // Custom date range
      const dayDiff = differenceInDays(dateRange.end, dateRange.start);
      
      if (dayDiff <= 30) {
        return productivityData.map(item => format(item.date, 'MMM d'));
      } else if (dayDiff <= 90) {
        return productivityData.map(item => format(item.date, 'MMM d'));
      } else {
        return productivityData.map(item => format(item.date, 'MMM yyyy'));
      }
    }
  }, [productivityData, dateRangeType, dateRange]);

  const series = [{
    name: 'Productivity Score',
    data: dateRangeType === 'day' 
      ? productivityData.map(item => item.score)
      : productivityData.map(item => item.score)
  }];

  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#8b5cf6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#8b5cf6',
            opacity: 0.6
          },
          {
            offset: 100,
            color: '#8b5cf6',
            opacity: 0
          }
        ]
      }
    },
    markers: {
      size: 4,
      colors: ["#8b5cf6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#6b7280',
          cssClass: 'text-xs'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Productivity Score'
      },
      min: 0
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(1) + " points";
        }
      }
    }
  };

  // If no tasks, show empty state
  if (tasks.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <LineChart size={20} className="mr-2 text-primary" />
          Productivity Trend
        </h3>
        <div className="h-[350px] flex items-center justify-center">
          <p className="text-center text-surface-500 dark:text-surface-400">
            No tasks found in the selected time period.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <LineChart size={20} className="mr-2 text-primary" />
        Productivity Trend
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Monitor your productivity patterns over time.
      </p>
      <div>
        <Chart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}

export default ProductivityTrendChart;