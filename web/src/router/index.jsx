import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from '../layout';

import Home from '../pages/home';
import Project from '../pages/project';
import Resources from '../pages/resources';
import Page404 from '../pages/404';
import Help from '../pages/help';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Project />} />
          <Route path="/project/:projectId" element={<Resources />} />
        </Route>
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
