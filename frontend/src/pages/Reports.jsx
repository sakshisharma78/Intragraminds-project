import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs
} from '@mui/material';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { ExportButton } from '../components/ui/ExportButton';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useDashboard } from '../hooks/useDashboard';

export const Reports = () => {
  const {
    detailedSales,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    loadDetailedSales
  } = useDashboard();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (newPage) => {
    loadDetailedSales(newPage + 1, detailedSales.pagination.limit);
  };

  const handleRowsPerPageChange = (newLimit) => {
    loadDetailedSales(1, newLimit);
  };

  const handleExport = async (format) => {
    // Implement export functionality
    console.log(`Exporting as ${format}...`);
  };

  const columns = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'orderId', label: 'Order ID', minWidth: 100 },
    { id: 'customer', label: 'Customer', minWidth: 170 },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 100,
      numeric: true,
      format: (value) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
    },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'region', label: 'Region', minWidth: 120 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'paymentMethod', label: 'Payment Method', minWidth: 150 }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Detailed analysis and export of sales data
        </Typography>
      </Box>

      <ErrorAlert error={error} sx={{ mb: 3 }} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="report tabs"
            >
              <Tab label="Sales Report" />
              <Tab label="Customer Analysis" />
              <Tab label="Product Performance" />
            </Tabs>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <FilterBar
                filters={filters}
                onFilterChange={updateFilters}
                onClearFilters={resetFilters}
                loading={isLoading}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' }
              }}
            >
              <ExportButton
                onExport={handleExport}
                loading={isLoading}
                disabled={!detailedSales.data.length}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={detailedSales.data}
        loading={isLoading}
        error={error}
        page={detailedSales.pagination.page - 1}
        rowsPerPage={detailedSales.pagination.limit}
        totalRows={detailedSales.pagination.total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};