import Chart from 'react-apexcharts'
import { PieChart } from 'lucide-react'

function CategoryDistributionChart({ tasks, categories }) {
  // Process data for the chart
  const categoryData = categories
    .filter(category => category.id !== 'all') // Exclude 'all' category
    .map(category => {
      const count = tasks.filter(task => task.categoryId === category.id).length;
      return {
        category,
        count
      };
    })
    .filter(item => item.count > 0); // Only include categories with tasks

  const series = categoryData.map(item => item.count);
  const labels = categoryData.map(item => item.category.name);
  const colors = categoryData.map(item => item.category.color);

  const options = {
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    labels,
    colors,
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
        return Math.round(val * 100 / total) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Tasks',
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'bottom',
      formatter: function(val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }
    }
  };

  // If no data, show empty state
  if (series.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <PieChart size={20} className="mr-2 text-primary" />
          Category Distribution
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
        <PieChart size={20} className="mr-2 text-primary" />
        Category Distribution
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Breakdown of tasks by category.
      </p>
      <div>
        <Chart
          options={options}
          series={series}
          type="donut"
          height={350}
        />
      </div>
    </div>
  );
}

export default CategoryDistributionChart;