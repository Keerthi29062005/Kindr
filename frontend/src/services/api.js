import axios from 'axios';

// Call backend DIRECTLY — no proxy
const BASE_URL = 'https://5000-cs-403735516902-default.cs-asia-southeast1-ajrg.cloudshell.dev/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,   // ← required for Cloud Shell auth to pass through
  headers: {
    'Content-Type': 'application/json',
  }
});

export const analyzeReport = async ({ text, location, reportType }) => {
  const { data } = await api.post('/analyze', {
    text,
    location: location || 'Unknown',
    reportType: reportType || 'General'
  });
  return data;
};

export const getAllReports = async () => {
  const { data } = await api.get('/reports');
  return data.reports || [];
};

export const getDashboardNeeds = async () => {
  const { data } = await api.get('/needs');
  return data;
};

export const registerVolunteer = async (volunteerData) => {
  const { data } = await api.post('/volunteers', volunteerData);
  return data;
};

export const getAllVolunteers = async () => {
  const { data } = await api.get('/volunteers');
  return data.volunteers || [];
};

export const matchVolunteer = async ({ volunteerSkills, volunteerLocation, volunteerId }) => {
  const { data } = await api.post('/match', { volunteerSkills, volunteerLocation, volunteerId });
  return data;
};

export const getInsights = async () => {
  const { data } = await api.post('/insights');
 let rawContent = data.insights;

  // 1. Check if it's a string containing markdown backticks
  if (typeof rawContent === 'string' && rawContent.includes('```json')) {
    // 2. Remove the ```json and ``` markers
    const cleanJson = rawContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    // 3. Convert the string into a real Object
    return JSON.parse(cleanJson);
  }
console.log(rawContent);
  return rawContent;
};

export default api;