import axios from 'axios';

const pendingMap = new Map();
const isDev = import.meta.env.MODE === 'development';

const service = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 10000,
});

// 请求拦截
service.interceptors.request.use(
    (config) => {
      removePending(config);
      !isDev && addPending(config);
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    },
);

service.interceptors.response.use(
    (response) => {
      removePending(response.config);
      const res = response.data;
      if (res.code === 10010) {
        window.location.href = res.data.loginUrl;
      }
      return res;
    },
    (error) => {
      error.config && removePending(error.config);
      console.log(error);
      return Promise.reject(error);
    },
);

function getPendingKey(config) {
  let {url, method, params, data} = config;
  // response里面返回的config.data是个字符串对象
  if (typeof data === 'string') data = JSON.parse(data);
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}

function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

export default service;
