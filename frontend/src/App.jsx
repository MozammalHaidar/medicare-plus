import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import ScrollTopButton from './components/ScrollTopButton/ScrollTopButton';
import ScrollProgress from './components/shared/ScrollProgress';
import ScrollToTop from './components/shared/ScrollToTop';
import PageTransition from './components/shared/PageTransition';
import ProtectedRoute from './components/shared/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Specialties = lazy(() => import('./pages/Specialties'));
const Appointment = lazy(() => import('./pages/Appointment'));
const Services = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <Loader />;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/doctors" element={<PageTransition><Doctors /></PageTransition>} />
              <Route path="/specialties" element={<PageTransition><Specialties /></PageTransition>} />
              <Route path="/appointment" element={<PageTransition><Appointment /></PageTransition>} />
              <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
              <Route
                path="/profile"
                element={
                  <PageTransition>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </PageTransition>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PageTransition>
                    <ProtectedRoute>
                      <MyAppointments />
                    </ProtectedRoute>
                  </PageTransition>
                }
              />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  );
}

export default App;
