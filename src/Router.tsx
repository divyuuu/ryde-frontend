// Router.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage/Authpage";
import Landing from "./pages/LandingPage/LandingPage";
import PassengerDashboard from "./pages/PassengerDashboard/PassengerDashboard";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Passenger Dashboard */}
        <Route path="/dashboard" element={<PassengerDashboard />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;