import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({
  data,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  height = 300,
  horizontal = false
}) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 500
        }
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            family: theme.typography.fontFamily
          }
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily
          }
        },
        grid: {
          color: theme.palette.divider
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            family: theme.typography.fontFamily
          }
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily
          }
        },
        grid: {
          color: theme.palette.divider
        }
      }
    }
  };

  return (
    <Box
      sx={{
        height,
        width: '100%',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Bar options={options} data={data} />
    </Box>
  );
};