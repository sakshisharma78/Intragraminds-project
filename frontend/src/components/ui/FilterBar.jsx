import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DateRangePicker } from './DateRangePicker';

export const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  regions = [],
  loading = false
}) => {
  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  const handleDateRangeChange = (startDate, endDate) => {
    onFilterChange({
      ...filters,
      startDate,
      endDate
    });
  };

  const handleSearchChange = (event) => {
    onFilterChange({
      ...filters,
      search: event.target.value
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() =>
                    onFilterChange({ ...filters, search: '' })
                  }
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 200 }}
        />

        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={handleDateRangeChange}
          disabled={loading}
        />

        <TextField
          select
          size="small"
          label="Category"
          value={filters.category || ''}
          onChange={handleChange('category')}
          disabled={loading}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Region"
          value={filters.region || ''}
          onChange={handleChange('region')}
          disabled={loading}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">
            <em>All Regions</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ ml: 'auto' }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Clear Filters">
              <span>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onClearFilters}
                  disabled={
                    loading ||
                    (!filters.search &&
                      !filters.startDate &&
                      !filters.endDate &&
                      !filters.category &&
                      !filters.region)
                  }
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Active Filters">
              <IconButton
                color="primary"
                disabled={loading}
                sx={{
                  bgcolor: Object.values(filters).some((v) => v)
                    ? 'primary.light'
                    : 'transparent'
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};