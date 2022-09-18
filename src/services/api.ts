import axios from 'axios';

export const local = axios.create({
  baseURL: 'http://localhost:3333/v1'
});

export const api = axios.create({
  baseURL: ''
});
