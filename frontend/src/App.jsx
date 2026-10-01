import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import SubmissionHistory from "./pages/SubmissionHistory";
import BattleRoom from "./pages/BattleRoom";
import BattleHistory from "./pages/BattleHistory";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import DailyChallenge from "./pages/DailyChallenge";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/problems"
                    element={
                        <ProtectedRoute>
                            <Problems />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/problems/:id"
                    element={
                        <ProtectedRoute>
                            <ProblemDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/submissions"
                    element={
                        <ProtectedRoute>
                            <SubmissionHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/battle-history"
                    element={
                        <ProtectedRoute>
                            <BattleHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/achievements"
                    element={
                        <ProtectedRoute>
                            <Achievements />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/daily-challenge"
                    element={
                        <ProtectedRoute>
                            <DailyChallenge />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/battle/:roomCode"
                    element={
                        <ProtectedRoute>
                            <BattleRoom />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
