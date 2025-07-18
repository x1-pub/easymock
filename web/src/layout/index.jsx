import React from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../components/Header';
import {AuthProvider} from '../lib/content';
import './index.less';

export default function Layout() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
    </AuthProvider>
  );
}
