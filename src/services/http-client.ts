import axios  from 'axios';


const httpClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 60000,
  headers: { 'Content-type': 'Application/json' },
});

//export const API_BASE_URL = httpClient;

export default httpClient;
