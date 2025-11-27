import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header/Header";
import { HomePage } from "./features/home/HomePage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { SearchPage } from "./features/search/SearchPage";
import { GamePage } from "./features/game/GamePage";
import { GlobalRankingPage } from "./features/ranking/GlobalRankingPage";
import { CreateRoadmapPage } from "./features/createRoadmap/CreateRoadmapPage";
import { RoadmapDetailsPage } from "./features/roadmap/RoadmapDetailsPage";
import { Toaster } from "react-hot-toast";
import { SyncProvider } from "./context/SyncContext";
import { Footer } from "./components/layout/Footer/Footer";
import { TermsPage } from "./features/legal/TermsPage";
import { PrivacyPage } from "./features/legal/PrivacyPage";

function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <BrowserRouter>
          <Header />

          <main>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  fontSize: "14px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                className: "",
                duration: 4000,
              }}
              containerStyle={{
                zIndex: 99999,
              }}
            />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/game/:gameId" element={<GamePage />} />
              <Route path="/global-ranking" element={<GlobalRankingPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/roadmap/:id"
                element={
                  <ProtectedRoute>
                    <RoadmapDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/create-roadmap"
                element={
                  <ProtectedRoute>
                    <CreateRoadmapPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </SyncProvider>
    </AuthProvider>
  );
}

export default App;
