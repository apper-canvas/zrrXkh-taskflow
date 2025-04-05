import Chart from 'react-apexcharts'
import { ActivitySquare } from 'lucide-react'

function PriorityBreakdownChart({ tasks }) {
  // Define priority levels and their display properties
  const priorities = [
    { id: 'high', name: 'High Priority', color: '#f43f5e' },
    { id: 'medium', name: 'Medium Priority', color: '#fb923c' },
    { id: 'low', name: 'Low Priority', color: '#3b82f6' }
  ];

  // Count tasks by priority and completion status
  const priorityData = priorities.map(priority => {
    const tasksWithPriority = tasks.filter(task => task.priority === priority.id);
    const completedCount = tasksWithPriority.filter(task => task.completed).length;
    const pendingCount = tasksWithPriority.length - completedCount;
    
    return {
      priority,
      completed: completedCount,
      pending: pendingCount,
      total: tasksWithPriority.length
    };
  });

  const series = [
    {
      name: 'Completed',
      data: priorityData.map(item => item.completed)
    },
    {
      name: 'Pending',
      data: priorityData.map(item => item.pending)
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      },
    },
    colors: ['#10b981', '#9ca3af'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: priorityData.map(item => item.priority.name),
    },
    yaxis: {
      title: {
        text: 'Number of Tasks'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tasks"
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  // If no data, show empty state
  if (tasks.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <ActivitySquare size={20} className="mr-2 text-primary" />
          Priority Breakdown
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
        <ActivitySquare size={20} className="mr-2 text-primary" />
        Priority Breakdown
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Tasks by priority level and completion status.
      </p>
      <div>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export default PriorityBreakdownChart;