import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { RouteProvider, useAppRouter } from "./context/RouteContext.jsx";
import { ThemeProvider, useAppTheme } from "./context/ThemeContext.jsx";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Library,
  Menu,
  X,
  LogOut,
  Facebook,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Palette,
} from "lucide-react";

// Import Pages
import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import MyListings from "./pages/MyListings.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Loader from "./components/Loader.jsx";

function AppContent() {
  const { currentPath, navigateTo } = useAppRouter();
  const { user, loading, logout } = useAuth();
  const { theme, setTheme, themes, isDarkMode } = useAppTheme();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close menus on path changes
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf7] dark:bg-stone-950 flex flex-col items-center justify-center p-4">
        <Loader message="Loading academic session. Please wait..." />
      </div>
    );
  }

  // Routing Switchboard
  const renderRoute = () => {
    const pathParts = currentPath.split("/");
    const rootPath = pathParts[1];

    switch (currentPath) {
      case "/":
      case "/home":
        return <Home />;
      case "/rooms":
        return <Rooms />;
      case "/add-room":
        return user ? <AddRoom /> : <Login />;
      case "/my-listings":
        return user ? <MyListings /> : <Login />;
      case "/my-bookings":
        return user ? <MyBookings /> : <Login />;
      case "/my-profile":
      case "/my_profile":
        return user ? <MyProfile /> : <Login />;
      case "/login":
        return <Login />;
      case "/register":
        return <Register />;
      default:
        // Handle parameterized rooms details route (/rooms/:id)
        if (rootPath === "rooms" && pathParts[2]) {
          return <RoomDetails />;
        }
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-base-100 text-base-content font-sans transition-colors duration-200">
      {/* 1. daisyUI Header / Navigation */}
      <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-base-300">
        <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Left section: Hamburger (mobile) + Logo */}
          <div className="navbar-start flex items-center gap-2">
            <div className="dropdown dropdown-bottom md:hidden relative">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle min-h-0 h-10 w-10 flex items-center justify-center"
              >
                <Menu className="h-5 w-5" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content absolute top-full left-0 mt-2 z-[60] p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li>
                  <button onClick={() => navigateTo("/")}>Home</button>
                </li>
                <li>
                  <button onClick={() => navigateTo("/rooms")}>Rooms</button>
                </li>
                {user ? (
                  <>
                    <li>
                      <button onClick={() => navigateTo("/add-room")}>
                        Add Room
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigateTo("/my-listings")}>
                        My Listings
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigateTo("/my-bookings")}>
                        My Bookings
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigateTo("/my_profile")}>
                        My Profile
                      </button>
                    </li>
                    <li className="divider my-1"></li>
                    <li>
                      <button onClick={logout} className="text-red-600">
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="divider my-1"></li>
                    <li>
                      <button onClick={() => navigateTo("/login")}>
                        Login
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigateTo("/register")}>
                        Register
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div
              onClick={() => navigateTo("/")}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-md transition duration-300 group-hover:scale-105">
                <Library className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-xl font-serif font-black tracking-tight text-base-content block leading-none">
                  StudyNook
                </span>
                <span className="text-[9px] font-mono tracking-widest text-secondary uppercase font-bold block mt-1">
                  Premium Quiet Cells
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Links (Center) */}
          <div className="navbar-center hidden md:flex items-center">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigateTo("/")}
                className={`btn btn-ghost btn-sm ${currentPath === "/" || currentPath === "/home" ? "btn-active font-bold text-primary" : ""}`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("/rooms")}
                className={`btn btn-ghost btn-sm ${currentPath === "/rooms" ? "btn-active font-bold text-primary" : ""}`}
              >
                Rooms
              </button>
              {user && (
                <>
                  <button
                    onClick={() => navigateTo("/add-room")}
                    className={`btn btn-ghost btn-sm ${currentPath === "/add-room" ? "btn-active font-bold text-primary" : ""}`}
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => navigateTo("/my-listings")}
                    className={`btn btn-ghost btn-sm ${currentPath === "/my-listings" ? "btn-active font-bold text-primary" : ""}`}
                  >
                    My Listings
                  </button>
                  <button
                    onClick={() => navigateTo("/my-bookings")}
                    className={`btn btn-ghost btn-sm ${currentPath === "/my-bookings" ? "btn-active font-bold text-primary" : ""}`}
                  >
                    My Bookings
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controls & Profile (Right) */}
          <div className="navbar-end flex items-center gap-2 sm:gap-3">
            {/* daisyUI Theme Controller / Dropdown Switcher */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-1.5 font-mono text-xs uppercase border border-base-300"
              >
                <Palette className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">{theme}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-48 z-[60] border border-base-300 mt-2"
              >
                <li className="menu-title font-mono text-[9px] uppercase font-bold text-base-content/55">
                  Select Theme
                </li>
                {themes.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center justify-between text-xs font-semibold py-2 px-3 ${theme === t.id ? "active text-primary-content" : ""}`}
                    >
                      <span>{t.name}</span>
                      {theme === t.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Profile Image - Click directly navigates to /my_profile */}
                <button
                  onClick={() => navigateTo("/my_profile")}
                  className="avatar hover:scale-105 transition active:scale-95 cursor-pointer flex items-center gap-2"
                  title="My Profile Settings"
                >
                  <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden">
                    <img
                      src={
                        user.photoUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
                      }
                      alt={user.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-semibold text-base-content hidden lg:inline max-w-28 truncate">
                    {user.name}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="btn btn-outline btn-error btn-xs gap-1 hidden sm:flex"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={() => navigateTo("/login")}
                  className="btn btn-ghost btn-sm text-xs"
                >
                  Login
                </button>
                <button
                  onClick={() => navigateTo("/register")}
                  className="btn btn-primary btn-sm text-xs shadow-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Page Stage Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Fully Responsive Modern Footer */}
      <footer className="bg-base-200 text-base-content border-t border-base-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-sm">
                  <Library className="w-4.5 h-4.5" />
                </div>
                <span className="text-lg font-serif font-black text-base-content">
                  StudyNook
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-80 max-w-xs">
                Peer-to-peer library study room ecosystem designed to eliminate
                double-booking friction. Find and secure high-focus quiet cells
                in seconds.
              </p>
            </div>

            {/* Useful Directory Column */}
            <div className="flex flex-col gap-2">
              <h6 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                Useful Directory
              </h6>
              <button
                onClick={() => navigateTo("/")}
                className="link link-hover text-xs text-left"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("/rooms")}
                className="link link-hover text-xs text-left"
              >
                Rooms Catalog
              </button>
              <button
                onClick={() => navigateTo("/add-room")}
                className="link link-hover text-xs text-left"
              >
                List a Room
              </button>
            </div>

            {/* Contact Registrar Column */}
            <div className="flex flex-col gap-2.5">
              <h6 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                Contact Registrar
              </h6>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">mdsagormia179@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-secondary" />
                <span>+880 1790-000000</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">Central Library Wing, Dhaka</span>
              </div>
            </div>

            {/* Social Channels Column */}
            <div className="flex flex-col gap-2">
              <h6 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                Social Channels
              </h6>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm btn-square hover:btn-primary"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm btn-square font-sans font-black text-xs hover:btn-secondary"
                >
                  X
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm btn-square hover:btn-primary"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm btn-square hover:btn-secondary"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-base-300 py-4 bg-base-300/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs opacity-75">
              © {new Date().getFullYear()} StudyNook Inc. All study desks
              protected.
            </p>
            <div className="flex gap-4 text-xs font-mono opacity-75">
              <a href="#" className="link link-hover">
                Terms of Service
              </a>
              <a href="#" className="link link-hover">
                Privacy Charter
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Sonner Toast System */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDarkMode ? "#1c1917" : "#fff",
            color: isDarkMode ? "#f5f5f4" : "#1c1917",
            border: isDarkMode ? "1px solid #2e2a24" : "1px solid #e7e5e4",
            borderRadius: "16px",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RouteProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RouteProvider>
    </ThemeProvider>
  );
}
