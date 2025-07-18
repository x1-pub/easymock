import React from 'react';
import {useContext, createContext, useEffect} from 'react';
import {useAsync} from './hooks';
import API from '../api';

const bootstrapUser = async () => {
  const user = await API.fetchUserinfo();
  return user.data;
};

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({children}) => {
  const {data: user, run} = useAsync();

  const logout = async () => await API.logout();

  useEffect(() => {
    run(bootstrapUser());
  }, []);

  return (
    <AuthContext.Provider
      value={{user, logout}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }
  return context;
};
