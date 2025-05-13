import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import SignupPage from "./pages/SignupPage";
import { useSelector, useDispatch } from "react-redux";
// @ts-ignore
import { useCheckAuthMutation } from "./redux/slices/api/authApi";
//@ts-ignore
import { Exit, setCredentials } from "./redux/slices/authSlices.js";


function Layout() {
  const user = useSelector((state: any) => state.auth.user);
  const theme = useSelector((state: any) => state.theme.theme);
  
  const location = useLocation();
  const dispatch = useDispatch();

  const [checkAuth, { isLoading }] = useCheckAuthMutation();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const validateToken = async () => {
      try {
        await checkAuth().unwrap();
        // dispatch(setCredentials(res.user));
      } catch (error) {
        dispatch(Exit());
      }
    };

    validateToken();

    intervalId = setInterval(() => {
      validateToken();
    }, 15 * 60 * 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkAuth, dispatch, user?.token]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  // Nếu chưa login => redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div data-theme={theme} className="w-screen h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
