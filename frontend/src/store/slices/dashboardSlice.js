import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchKPIData = createAsyncThunk(
  'dashboard/fetchKPIData',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/kpi`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSalesTrend = createAsyncThunk(
  'dashboard/fetchSalesTrend',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/sales-trend`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSalesByCategory = createAsyncThunk(
  'dashboard/fetchSalesByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/sales-by-category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRevenueByRegion = createAsyncThunk(
  'dashboard/fetchRevenueByRegion',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/revenue-by-region`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDetailedSales = createAsyncThunk(
  'dashboard/fetchDetailedSales',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/detailed-sales`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, ...filters }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  kpiData: {
    totalRevenue: 0,
    totalOrders: 0,
    newUsers: 0,
    bounceRate: 0
  },
  salesTrend: [],
  salesByCategory: [],
  revenueByRegion: [],
  detailedSales: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  },
  filters: {
    startDate: null,
    endDate: null,
    region: '',
    category: ''
  },
  isLoading: false,
  error: null
};

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // KPI Data
      .addCase(fetchKPIData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKPIData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiData = action.payload.data;
      })
      .addCase(fetchKPIData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch KPI data';
      })

      // Sales Trend
      .addCase(fetchSalesTrend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesTrend = action.payload.data;
      })
      .addCase(fetchSalesTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch sales trend';
      })

      // Sales by Category
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesByCategory = action.payload.data;
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch sales by category';
      })

      // Revenue by Region
      .addCase(fetchRevenueByRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueByRegion = action.payload.data;
      })
      .addCase(fetchRevenueByRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch revenue by region';
      })

      // Detailed Sales
      .addCase(fetchDetailedSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailedSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailedSales = action.payload;
      })
      .addCase(fetchDetailedSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch detailed sales';
      });
  }
});

export const { setFilters, clearFilters, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;