import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { MobileFrame } from './components/layout/MobileFrame';

// Pages
import { Landing } from './pages/Landing';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { NewDonation } from './pages/donor/NewDonation';
import { Passcard } from './pages/donor/Passcard';
import { DonorHistory } from './pages/donor/DonorHistory';
import { RecipientFeed } from './pages/recipient/RecipientFeed';
import { RecipientTracking } from './pages/recipient/RecipientTracking';
import { DriverHome } from './pages/driver/DriverHome';
import { DriverJob } from './pages/driver/DriverJob';
import { EnterpriseDashboard } from './pages/enterprise/EnterpriseDashboard';
import { AdminMap } from './pages/admin/AdminMap';

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />

            {/* AppShell routes */}
            <Route element={<AppShell />}>
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/donor/new" element={<NewDonation />} />
              <Route path="/donor/passcard/:postId" element={<Passcard />} />
              <Route path="/donor/history" element={<DonorHistory />} />
              <Route path="/recipient" element={<RecipientFeed />} />
              <Route path="/recipient/tracking/:jobId" element={<RecipientTracking />} />
              <Route path="/enterprise" element={<EnterpriseDashboard />} />
            </Route>

            {/* Driver MobileFrame routes */}
            <Route
              path="/driver"
              element={
                <MobileFrame>
                  <DriverHome />
                </MobileFrame>
              }
            />
            <Route
              path="/driver/job/:jobId"
              element={
                <MobileFrame>
                  <DriverJob />
                </MobileFrame>
              }
            />

            {/* Admin custom dark layout */}
            <Route path="/admin" element={<AdminMap />} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}
