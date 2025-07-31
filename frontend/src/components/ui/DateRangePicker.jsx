import React, { useState } from 'react';
import {
  Box,
  TextField,
  Popover,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  maxDate = new Date(),
  minDate = new Date(2020, 0, 1)
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onChange?.(tempStartDate, tempEndDate);
    handleClose();
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          variant="outlined"
          onClick={handleClick}
          startIcon={<CalendarIcon />}
          sx={{ minWidth: 200 }}
        >
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Select Date Range'}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            sx: { p: 3, width: 320 }
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Start Date
              </Typography>
              <DatePicker
                value={tempStartDate}
                onChange={setTempStartDate}
                maxDate={tempEndDate || maxDate}
                minDate={minDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                End Date
              </Typography>
              <DatePicker
                value={tempEndDate}
                onChange={setTempEndDate}
                maxDate={maxDate}
                minDate={tempStartDate || minDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Box>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button onClick={handleCancel} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                disabled={
                  !tempStartDate ||
                  !tempEndDate ||
                  tempStartDate > tempEndDate
                }
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};