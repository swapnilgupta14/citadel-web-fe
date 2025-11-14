import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./pages/HomePage";
import { ConnectPage } from "./pages/ConnectPage";
import { ExplorePage } from "./pages/ExplorePage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { EventBookingsPage } from "./pages/profile/EventBookingsPage";
import { EventDetailPage } from "./pages/events/EventDetailPage";
import { GuidelinesPage } from "./pages/events/GuidelinesPage";
import { DinnerBookedSuccessPage } from "./pages/events/DinnerBookedSuccessPage";
import { PrivacyPolicyTermsPage } from "./pages/legal/PrivacyPolicyTermsPage";
import { HelpSupportPage } from "./pages/help/HelpSupportPage";
import { SignupFlow } from "./routes/SignupFlow";
import { LoginFlow } from "./routes/LoginFlow";

const WriteToUsPage = lazy(() =>
  import("./pages/help/WriteToUsPage").then((module) => ({
    default: module.WriteToUsPage,
  }))
);
import {
  EventsRoute,
  LocationRoute,
  AreaSelectionRoute,
  QuizRoute,
  PersonalityQuizRoute,
  FindingMatchesRoute,
} from "./routes/protected";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ProtectedPagesLayout } from "./components/layout/ProtectedPagesLayout";
import { auth } from "./lib/storage/auth";
import { signupPersistence } from "./lib/storage/signupPersistence";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const img = new Image();
    img.src = "/Splash/waves.svg";
  }, []);

  const handleConnectSignup = () => {
    signupPersistence.clearSignupData();
    navigate("/signup");
  };

  return (
    <MobileLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/connect"
          element={<ConnectPage onContinue={handleConnectSignup} />}
        />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/login" element={<LoginFlow />} />

        <Route
          element={
            <ProtectedRoute>
              <ProtectedPagesLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/events" element={<EventsRoute />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/event-bookings" element={<EventBookingsPage />} />
          <Route
            path="/profile/event-bookings"
            element={<EventBookingsPage />}
          />

          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route
            path="/events/:eventId/guidelines"
            element={<GuidelinesPage />}
          />
          <Route
            path="/events/:eventId/success"
            element={<DinnerBookedSuccessPage />}
          />
          <Route
            path="/profile/legal/privacy-terms"
            element={<PrivacyPolicyTermsPage />}
          />
          <Route path="/profile/help-support" element={<HelpSupportPage />} />
          <Route
            path="/profile/help-support/write-to-us"
            element={
              <Suspense fallback={null}>
                <WriteToUsPage />
              </Suspense>
            }
          />

          <Route path="/location" element={<LocationRoute />} />
          <Route path="/area-selection" element={<AreaSelectionRoute />} />
          <Route path="/quiz" element={<QuizRoute />} />
          <Route path="/personality-quiz" element={<PersonalityQuizRoute />} />
          <Route path="/finding-matches" element={<FindingMatchesRoute />} />
        </Route>

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
      </AnimatePresence>
    </MobileLayout>
  );
}

export default App;
