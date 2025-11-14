import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header/Header";
import { HomePage } from "./pages/HomePage/HomePage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { SearchPage } from "./pages/SearchPage/SearchPage";
import { GamePage } from "./pages/GamePage/GamePage";
import { RoadmapPage } from "./pages/RoadmapPage/RoadmapPage";
import { GlobalRankingPage } from "./pages/GlobalRankingPage/GlobalRankingPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
