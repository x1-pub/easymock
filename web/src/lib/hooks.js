import {useState} from 'react';


export const useAsync = (initialState, initialConfig) => {
  const defaultInitialState = {
    error: null,
    data: null,
    stat: 'idle',
  };

  const defaultConfig = {
    throwOnError: false,
  };

  const config = {...defaultConfig, ...initialConfig};

  const [state, setState] = useState({
    ...defaultInitialState,
    ...initialState,
  });

  const setData = (data) => setState({
    data,
    stat: 'success',
    error: null,
  });

  const setError = (error) => setState({
    error,
    stat: 'error',
    data: null,
  });

  const run = (promise) => {
    if (!promise || !promise.then) {
      throw new Error('请传入 Promise 类型数据');
    }
    setState({...state, stat: 'loading'});
    return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          // catch会消化异常 如果不主动抛出 外面是接受不到的
          if (config.throwOnError) return Promise.reject(error);
          return error;
        });
  };

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state,
  };
};
