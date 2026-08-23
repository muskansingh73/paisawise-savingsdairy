import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser({ name, email, password, monthly_income, savings_goal }) {
  const res = await api.post('/auth/register', { name, email, password, monthly_income, savings_goal });
  localStorage.setItem('pw_token', res.data.token);
  return res.data;
}

export async function loginUser({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('pw_token', res.data.token);
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem('pw_token');
}

export function getToken() {
  return localStorage.getItem('pw_token');
}

export async function fetchUser() {
  const res = await api.get('/user/me');
  return res.data;
}

export async function updateUser(data) {
  const res = await api.patch('/user/me', data);
  return res.data;
}

export async function fetchTodayEntries(date) {
  const params = date ? { date } : {};
  const res = await api.get('/expenses/daily', { params });
  return res.data;
}

export async function fetchMonthlyExpenses() {
  const res = await api.get('/expenses/monthly');
  return res.data;
}

export async function fetchWeeklySpend() {
  const res = await api.get('/expenses/weekly');
  return res.data;
}

export async function fetchMonthlyTrend() {
  const res = await api.get('/expenses/trend');
  return res.data;
}

export async function fetchPastMonths() {
  const res = await api.get('/expenses/history');
  return res.data;
}

export async function addExpenseEntry(entry) {
  const res = await api.post('/expenses', entry);
  return res.data;
}

export async function deleteExpenseEntry(id) {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
}

export async function fetchCategoryBudgets() {
  const res = await api.get('/budgets');
  return res.data;
}

export async function fetchSavingTips() {
  const res = await api.get('/tips');
  return res.data;
}

export async function fetchDetailedTips() {
  const res = await api.get('/tips');
  return res.data;
}

export function getTotalSpent(expenses = {}) {
  return Object.values(expenses).reduce((a, b) => a + b, 0);
}

export function getTodayTotal(entries = []) {
  return entries.reduce((a, e) => a + e.amount, 0);
}