// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import theme from './styles/theme';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;