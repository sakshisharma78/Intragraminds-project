import React from 'react';
import { Grid, Box } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Group,
  Speed
} from '@mui/icons-material';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { MapChart } from '../components/charts/MapChart';
import { FilterBar } from '../components/ui/FilterBar';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard = () => {
  const {
    kpiData,
    salesTrend,
    salesByCategory,
    revenueByRegion,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters
  } = useDashboard();

  const salesTrendData = {
    labels: salesTrend.map((item) => item.date),
    datasets: [
      {
        label: 'Sales',
        data: salesTrend.map((item) => item.amount),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true
      }
    ]
  };

  const salesByCategoryData = {
    labels: salesByCategory.map((item) => item.category),
    datasets: [
      {
        data: salesByCategory.map((item) => item.amount),
        backgroundColor: [
          '#1976d2',
          '#2196f3',
          '#64b5f6',
          '#90caf9',
          '#bbdefb'
        ]
      }
    ]
  };

  const revenueByRegionData = {
    labels: revenueByRegion.map((item) => item.region),
    datasets: [
      {
        label: 'Revenue',
        data: revenueByRegion.map((item) => item.revenue),
        backgroundColor: '#1976d2'
      }
    ]
  };

  return (
    <Box>
      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={resetFilters}
        loading={isLoading}
      />

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={kpiData.totalRevenue}
            icon={TrendingUp}
            percentageChange={12.5}
            loading={isLoading}
            error={error}
            prefix="$"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={kpiData.totalOrders}
            icon={ShoppingCart}
            percentageChange={8.2}
            loading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users"
            value={kpiData.newUsers}
            icon={Group}
            percentageChange={-3.8}
            loading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bounce Rate"
            value={kpiData.bounceRate}
            icon={Speed}
            percentageChange={-2.1}
            loading={isLoading}
            error={error}
            suffix="%"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <LineChart
            data={salesTrendData}
            title="Sales Trend"
            xAxisLabel="Date"
            yAxisLabel="Amount ($)"
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PieChart
            data={salesByCategoryData}
            title="Sales by Category"
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarChart
            data={revenueByRegionData}
            title="Revenue by Region"
            xAxisLabel="Region"
            yAxisLabel="Revenue ($)"
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MapChart
            data={revenueByRegion.map((item) => ({
              id: item.region,
              value: item.revenue
            }))}
            title="Geographic Distribution"
            height={400}
          />
        </Grid>
      </Grid>
    </Box>
  );
};