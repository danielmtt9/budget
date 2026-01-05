import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Budget from './pages/Budget';

import { PrivacyProvider } from './contexts/PrivacyContext';

function App() {
  return (
    <PrivacyProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="budget" element={<Budget />} />
          </Route>
        </Routes>
      </Router>
    </PrivacyProvider>
  );
}

export default App;