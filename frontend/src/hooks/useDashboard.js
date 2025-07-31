import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchKPIData,
  fetchSalesTrend,
  fetchSalesByCategory,
  fetchRevenueByRegion,
  fetchDetailedSales,
  setFilters,
  clearFilters
} from '../store/slices/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const {
    kpiData,
    salesTrend,
    salesByCategory,
    revenueByRegion,
    detailedSales,
    filters,
    isLoading,
    error
  } = useSelector((state) => state.dashboard);

  const loadDashboardData = useCallback(() => {
    dispatch(fetchKPIData(filters));
    dispatch(fetchSalesTrend(filters));
    dispatch(fetchSalesByCategory());
    dispatch(fetchRevenueByRegion());
    dispatch(fetchDetailedSales({ page: 1, limit: 10, filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const loadDetailedSales = useCallback(
    (page = 1, limit = 10) => {
      dispatch(fetchDetailedSales({ page, limit, filters }));
    },
    [dispatch, filters]
  );

  return {
    // Data
    kpiData,
    salesTrend,
    salesByCategory,
    revenueByRegion,
    detailedSales,
    filters,
    isLoading,
    error,

    // Actions
    loadDashboardData,
    updateFilters,
    resetFilters,
    loadDetailedSales
  };
};