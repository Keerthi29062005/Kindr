import axios from 'axios';
 
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
 
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for AI calls
});
 
// ─── Reports ──────────────────────────────────────────────────────────────────
export const analyzeReport = async ({ text, location, reportType }) => {
  const payload = {
    text,
    location: location || 'Unknown',
    reportType: reportType || 'General'
  };

  const { data } = await api.post('/analyze', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
};
 
export const getAllReports = async () => {
  const { data } = await api.get('/reports');
  return data.reports || [];
};
 
// ─── Dashboard Needs ──────────────────────────────────────────────────────────
export const getDashboardNeeds = async () => {
  const { data } = await api.get('/needs');
  return data;
};
 
// ─── Volunteers ───────────────────────────────────────────────────────────────
export const registerVolunteer = async (volunteerData) => {
  const { data } = await api.post('/volunteers', volunteerData);
  return data;
};
 
export const getAllVolunteers = async () => {
  const { data } = await api.get('/volunteers');
  return data.volunteers || [];
};
 
// ─── Matching ─────────────────────────────────────────────────────────────────
export const matchVolunteer = async ({ volunteerSkills, volunteerLocation, volunteerId }) => {
  const { data } = await api.post('/match', { volunteerSkills, volunteerLocation, volunteerId });
  return data;
};
 
// ─── Insights ─────────────────────────────────────────────────────────────────
export const getInsights = async () => {
  const { data } = await api.post('/insights');
  return data.insights;
};
 
export default api;