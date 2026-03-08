import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdoptionPage from "./pages/AdoptionPage";
import AccountPage from "./pages/AccountPage";
import PetCareTipsPage from "./pages/PetCareTipsPage";
import StrayAnimalRescuePage from "./pages/StrayAnimalRescuePage";
import PetAdoptionPage from "./pages/PetAdoptionPage";
import AnimalFirstAidPage from "./pages/AnimalFirstAidPage";
import ResponsiblePetOwnershipPage from "./pages/ResponsiblePetOwnershipPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/petcaretips" element={<PetCareTipsPage />} />
            <Route
              path="/strayanimalrescue"
              element={<StrayAnimalRescuePage />}
            />
            <Route path="/petadoption" element={<PetAdoptionPage />} />
            <Route path="/animalfirstaid" element={<AnimalFirstAidPage />} />
            <Route
              path="/responsiblepetownership"
              element={<ResponsiblePetOwnershipPage />}
            />
            <Route
              path="/volunteer"
              element={
                <ProtectedRoute roles={["volunteer"]}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
