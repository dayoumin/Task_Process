import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from './Dashboard';
import DesignSystem from './DesignSystem';
import Learning from './Learning';
import Architecture from './Architecture';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="design-system" element={<DesignSystem />} />
        <Route path="learning" element={<Learning />} />
        <Route path="learning/:topic" element={<Learning />} />
        <Route path="architecture" element={<Architecture />} />
      </Route>
    </Routes>
  );
}
