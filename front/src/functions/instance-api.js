import axios from 'axios';
import { getToken } from './utils';

const API_BASE_URL =
  process.env.NODE_ENV === 'development2'
    ? 'http://localhost:2727/api/v1'
    : 'https://im.nodeeweb.com/api/v1';
async function query(configs) {
  configs.url = `${API_BASE_URL}/${configs.url}`;
  try {
    const response = await axios({
      ...configs,
      headers: { ...configs.headers, token: getToken() },
      timeout: 20 * 60 * 1000,
    });
    return response.status === 204 ? {} : response.data;
  } catch (err) {
    console.log({
      data: err.response?.data,
      code: err.code,
      message: err.message,
    });
    return null;
  }
}

export function getAllInstances() {
  return query({ method: 'get', url: 'instance' });
}
export function getOneInstance(id) {
  return query({ method: 'get', url: `instance/${id}` });
}
export function createInstance(data) {
  return query({ method: 'post', url: 'instance', data });
}

export function updateInstance(id, data) {
  return query({ method: 'patch', url: `instance/${id}`, data });
}
export function deleteInstance(id) {
  return query({ method: 'delete', url: `instance/${id}` });
}
export function getAllJobs() {
  return query({ method: 'get', url: 'job' });
}
export function getOneJob(id) {
  return query({ method: 'get', url: `job/${id}` });
}
