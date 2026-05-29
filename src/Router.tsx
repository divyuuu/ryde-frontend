// Router.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage/Authpage";
import Landing from "./pages/LandingPage/LandingPage";
import PassengerDashboard from "./pages/PassengerDashboard/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard/DriverDashboard";
import DriverVehicles from "./pages/DriverVehicles/DriverVehicles";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Passenger Dashboard */}
        <Route path="/dashboard/:uuid" element={<PassengerDashboard />} />

        {/* Driver Dashboard */}
        <Route path="/driver-dashboard/:uuid" element={<DriverDashboard />} />

        {/* Driver Vehicles */}
        <Route path="/driver-vehicles/:uuid" element={<DriverVehicles />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;