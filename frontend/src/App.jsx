import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./auth/useAuth";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./auth/useTheme";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, } = useAuth();
  const {theme,setTheme,restoreLastUserTheme}=useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 
  useEffect(() => {
    if (authUser) {
      restoreLastUserTheme();
    } else if (!localStorage.getItem("chat-theme")) {
      setTheme("dark", false);
    }
  }, [authUser, setTheme, restoreLastUserTheme]);


  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
