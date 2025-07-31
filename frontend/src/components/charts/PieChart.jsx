import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({
  data,
  title = '',
  height = 300,
  legendPosition = 'right'
}) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: legendPosition,
        labels: {
          font: {
            family: theme.typography.fontFamily
          },
          padding: 20
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
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc, current) => acc + current, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
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
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Pie options={options} data={data} />
    </Box>
  );
};