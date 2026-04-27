import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/common/ProtectedRoute.js';

// Landing
import Landing from './pages/Landing.js';

// Auth
import Login from './pages/auth/Login.js';
import ForgotPassword from './pages/auth/ForgotPassword.js';

// Barangay
import BarangayDashboard from './pages/barangay/Dashboard.js';
import CreateBlotter from './pages/barangay/CreateBlotter.js';
import EditBlotter from './pages/barangay/EditBlotter.js';
import BarangayBlotterList from './pages/barangay/BlotterList.js';
import BarangayBlotterView from './pages/barangay/BlotterView.js';

// Municipal
import MunicipalDashboard from './pages/municipal/Dashboard.js';
import MunicipalBlotterList from './pages/municipal/BlotterList.js';
import MunicipalBlotterView from './pages/municipal/BlotterView.js';
import MunicipalReports from './pages/municipal/Reports.js';

// Provincial
import ProvinceDashboard from './pages/province/Dashboard.js';
import ProvinceBlotterList from './pages/province/BlotterList.js';
import ProvinceBlotterView from './pages/province/BlotterView.js';
import MunicipalBreakdown from './pages/province/MunicipalBreakdown.js';
import ProvinceReports from './pages/province/Reports.js';

// Super Admin
import SuperAdminDashboard from './pages/superadmin/Dashboard.js';
import AccountManagement from './pages/superadmin/AccountManagement.js';
import AddAccount from './pages/superadmin/AddAccount.js';
import BarangayManagement from './pages/superadmin/BarangayManagement.js';
import MunicipalManagement from './pages/superadmin/MunicipalManagement.js';
import ProvinceManagement from './pages/superadmin/ProvinceManagement.js';
import SuperAdminBlotterList from './pages/superadmin/BlotterList.js';
import SuperAdminReports from './pages/superadmin/Reports.js';
import AuditLog from './pages/superadmin/AuditLog.js';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />

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
          <Route path="/barangay/blotters/:id/edit" element={
            <ProtectedRoute role="barangay"><EditBlotter /></ProtectedRoute>
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
