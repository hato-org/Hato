import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import RequireLogin from "./components/login/RequireLogin";
import { Setting } from "./components/settings";
import { useAuth } from "./modules/auth";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Timetable from "./pages/Timetable";

export const Router = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Dashboard /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/settings"
          element={
            <RequireLogin>
              <Settings />
            </RequireLogin>
          }
        >
          <Route path=":category" element={<Setting />} />
        </Route>
        <Route path='/timetable' element={<Timetable />}>

        </Route>
        <Route path='/calendar'>
          <Route path='events/:id' element={<EventDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};
