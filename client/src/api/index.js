import axios from 'axios';

// API 基础 URL - 始终使用相对路径，通过 Nginx 反向代理
const API_BASE_URL = '/api';

const API_TOKEN = import.meta.env.VITE_MVSEP_API_KEY || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  // 生产环境需要配置跨域
  headers: {
    'Accept': 'application/json',
  }
});

// 创建分离任务
export const createSeparation = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('api_token', API_TOKEN);
  formData.append('audiofile', file);
  formData.append('sep_type', options.sep_type || '11');
  formData.append('output_format', options.output_format || '0');
  
  if (options.add_opt1) formData.append('add_opt1', options.add_opt1);
  if (options.add_opt2) formData.append('add_opt2', options.add_opt2);
  if (options.add_opt3) formData.append('add_opt3', options.add_opt3);

  const response = await apiClient.post('/separation/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// 获取分离结果
export const getSeparationResult = async (hash, mirror = false) => {
  const params = { hash };
  if (mirror) {
    params.mirror = 1;
    params.api_token = API_TOKEN;
  }
  
  const response = await apiClient.get('/separation/get', { params });
  return response.data;
};

// 取消分离任务
export const cancelSeparation = async (hash) => {
  const formData = new FormData();
  formData.append('api_token', API_TOKEN);
  formData.append('hash', hash);
  
  const response = await apiClient.post('/separation/cancel', formData);
  return response.data;
};

// 获取队列信息
export const getQueueInfo = async () => {
  const response = await apiClient.get('/app/queue', {
    params: { api_token: API_TOKEN }
  });
  return response.data;
};

// 获取用户信息
export const getUserInfo = async () => {
  const response = await apiClient.get('/app/user', {
    params: { api_token: API_TOKEN }
  });
  return response.data;
};

// 获取分离历史
export const getSeparationHistory = async (start = 0, limit = 20) => {
  const response = await apiClient.get('/app/separation_history', {
    params: { 
      api_token: API_TOKEN,
      start, 
      limit 
    }
  });
  return response.data;
};

export default {
  createSeparation,
  getSeparationResult,
  cancelSeparation,
  getQueueInfo,
  getUserInfo,
  getSeparationHistory
};
