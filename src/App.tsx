import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ClientPortalPage from './pages/ClientPortalPage';
import TicketsPage from './pages/TicketsPage';
import DesignSystemPage from './pages/DesignSystemPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ClientPortalPage />} />
        <Route path="/agent" element={<TicketsPage />} />
        <Route path="/design" element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
