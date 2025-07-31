import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({
  data,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  height = 300
}) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      <Line options={options} data={data} />
    </Box>
  );
};