import { Routes, Route, Navigate } from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./pages/HomePage";
import { ConnectPage } from "./pages/ConnectPage";
import { SignupFlow } from "./routes/SignupFlow";
import { LoginFlow } from "./routes/LoginFlow";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ProtectedPagesLayout } from "./components/layout/ProtectedPagesLayout";
import { auth } from "./lib/storage/auth";
import { signupPersistence } from "./lib/storage/signupPersistence";

function App() {
  const handleConnectSignup = () => {
    signupPersistence.clearSignupData();
    window.location.href = "/signup";
  };

  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/connect"
          element={<ConnectPage onContinue={handleConnectSignup} />}
        />

        <Route path="/signup" element={<SignupFlow />} />

        <Route path="/login" element={<LoginFlow />} />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/area-selection"
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            auth.isAuthenticated() ? (
              <Navigate to="/events" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </MobileLayout>
  );
}

export default App;
