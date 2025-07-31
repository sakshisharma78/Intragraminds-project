import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  percentageChange,
  loading = false,
  error = null,
  prefix = '',
  suffix = ''
}) => {
  const theme = useTheme();

  const isPositiveChange = percentageChange > 0;
  const formattedChange = Math.abs(percentageChange).toFixed(1);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  {title}
                </Typography>
                <Typography variant="h4" component="div">
                  {prefix}
                  {value}
                  {suffix}
                </Typography>
              </Box>
              {Icon && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Icon
                    sx={{
                      color: theme.palette.primary.main
                    }}
                  />
                </Box>
              )}
            </Box>
            {percentageChange !== undefined && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                {isPositiveChange ? (
                  <TrendingUp
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: 20,
                      mr: 0.5
                    }}
                  />
                ) : (
                  <TrendingDown
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: 20,
                      mr: 0.5
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isPositiveChange
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {formattedChange}%
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: 1 }}
                >
                  vs last period
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};