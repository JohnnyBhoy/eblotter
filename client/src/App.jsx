import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Auth
import Login from './pages/auth/Login.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Barangay
import BarangayDashboard from './pages/barangay/Dashboard.jsx';
import CreateBlotter from './pages/barangay/CreateBlotter.jsx';
import BarangayBlotterList from './pages/barangay/BlotterList.jsx';
import BarangayBlotterView from './pages/barangay/BlotterView.jsx';

// Municipal
import MunicipalDashboard from './pages/municipal/Dashboard.jsx';
import MunicipalBlotterList from './pages/municipal/BlotterList.jsx';
import MunicipalBlotterView from './pages/municipal/BlotterView.jsx';
import MunicipalReports from './pages/municipal/Reports.jsx';

// Provincial
import ProvinceDashboard from './pages/province/Dashboard.jsx';
import ProvinceBlotterList from './pages/province/BlotterList.jsx';
import ProvinceBlotterView from './pages/province/BlotterView.jsx';
import MunicipalBreakdown from './pages/province/MunicipalBreakdown.jsx';
import ProvinceReports from './pages/province/Reports.jsx';

// Super Admin
import SuperAdminDashboard from './pages/superadmin/Dashboard.jsx';
import AccountManagement from './pages/superadmin/AccountManagement.jsx';
import AddAccount from './pages/superadmin/AddAccount.jsx';
import BarangayManagement from './pages/superadmin/BarangayManagement.jsx';
import MunicipalManagement from './pages/superadmin/MunicipalManagement.jsx';
import ProvinceManagement from './pages/superadmin/ProvinceManagement.jsx';
import SuperAdminBlotterList from './pages/superadmin/BlotterList.jsx';
import SuperAdminReports from './pages/superadmin/Reports.jsx';
import AuditLog from './pages/superadmin/AuditLog.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Barangay routes */}
          <Route path="/barangay/dashboard" element={
            <ProtectedRoute role="barangay"><BarangayDashboard /></ProtectedRoute>
          } />
          <Route path="/barangay/blotters" element={
            <ProtectedRoute role="barangay"><BarangayBlotterList /></ProtectedRoute>
          } />
          <Route path="/barangay/blotters/create" element={
            <ProtectedRoute role="barangay"><CreateBlotter /></ProtectedRoute>
          } />
          <Route path="/barangay/blotters/:id" element={
            <ProtectedRoute role="barangay"><BarangayBlotterView /></ProtectedRoute>
          } />

          {/* Municipal routes */}
          <Route path="/municipal/dashboard" element={
            <ProtectedRoute role="municipal"><MunicipalDashboard /></ProtectedRoute>
          } />
          <Route path="/municipal/blotters" element={
            <ProtectedRoute role="municipal"><MunicipalBlotterList /></ProtectedRoute>
          } />
          <Route path="/municipal/blotters/:id" element={
            <ProtectedRoute role="municipal"><MunicipalBlotterView /></ProtectedRoute>
          } />
          <Route path="/municipal/reports" element={
            <ProtectedRoute role="municipal"><MunicipalReports /></ProtectedRoute>
          } />

          {/* Provincial routes */}
          <Route path="/province/dashboard" element={
            <ProtectedRoute role="provincial"><ProvinceDashboard /></ProtectedRoute>
          } />
          <Route path="/province/blotters" element={
            <ProtectedRoute role="provincial"><ProvinceBlotterList /></ProtectedRoute>
          } />
          <Route path="/province/blotters/:id" element={
            <ProtectedRoute role="provincial"><ProvinceBlotterView /></ProtectedRoute>
          } />
          <Route path="/province/municipal-breakdown" element={
            <ProtectedRoute role="provincial"><MunicipalBreakdown /></ProtectedRoute>
          } />
          <Route path="/province/reports" element={
            <ProtectedRoute role="provincial"><ProvinceReports /></ProtectedRoute>
          } />

          {/* Super Admin routes */}
          <Route path="/superadmin/dashboard" element={
            <ProtectedRoute role="super_admin"><SuperAdminDashboard /></ProtectedRoute>
          } />
          <Route path="/superadmin/accounts" element={
            <ProtectedRoute role="super_admin"><AccountManagement /></ProtectedRoute>
          } />
          <Route path="/superadmin/accounts/add" element={
            <ProtectedRoute role="super_admin"><AddAccount /></ProtectedRoute>
          } />
          <Route path="/superadmin/barangays" element={
            <ProtectedRoute role="super_admin"><BarangayManagement /></ProtectedRoute>
          } />
          <Route path="/superadmin/municipalities" element={
            <ProtectedRoute role="super_admin"><MunicipalManagement /></ProtectedRoute>
          } />
          <Route path="/superadmin/provinces" element={
            <ProtectedRoute role="super_admin"><ProvinceManagement /></ProtectedRoute>
          } />
          <Route path="/superadmin/blotters" element={
            <ProtectedRoute role="super_admin"><SuperAdminBlotterList /></ProtectedRoute>
          } />
          <Route path="/superadmin/blotters/:id" element={
            <ProtectedRoute role="super_admin"><ProvinceBlotterView /></ProtectedRoute>
          } />
          <Route path="/superadmin/reports" element={
            <ProtectedRoute role="super_admin"><SuperAdminReports /></ProtectedRoute>
          } />
          <Route path="/superadmin/audit" element={
            <ProtectedRoute role="super_admin"><AuditLog /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
