/**
 * App Component
 * 
 * This is the main application component - think of it as the brain of our app.
 * It manages the overall layout, navigation, theme, and coordinates all the different pages.
 * 
 * What it does:
 * - Controls which page is currently shown (Dashboard, Tasks, Calendar)
 * - Manages the theme (light/dark mode)
 * - Handles the sidebar open/close state
 * - Detects if user is on mobile device
 * - Manages global search functionality
 */

import React, { useEffect, useState } from 'react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage.tsx';
import { fetchProfile } from './services/authService';
import type { AuthResponse, AuthUser } from './services/authService';
import './App.css';


/**
 * App component - Root component of the application
 * 
 * This component is like the main controller that coordinates everything.
 * It keeps track of what page you're on, what you're searching for, 
 * whether dark mode is on, and if the sidebar should be visible.
 */
const App: React.FC = () => {
  // State to track which page we're currently viewing
  // 'tasks' is the default page when app first loads
  const [currentView, setCurrentView] = useState('tasks');

  // Stores the search text that user types in the header search bar
  // This gets passed down to TasksPage to filter tasks
  const [searchQuery, setSearchQuery] = useState('');

  // Theme state - 'light' or 'dark'
  // We start with 'light' but will check localStorage and system preference
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Controls whether the sidebar is expanded or collapsed
  // On desktop, it starts open. On mobile, we'll close it automatically
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tracks if user is on a mobile device (screen width < 768px)
  // This helps us adjust the UI behavior for mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('auth_token')
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);

  // used useCallback to maintain referential equality. Since handleLogout is a dependency in my useEffect,
  //  if I didn't wrap it in useCallback, it would be re-created on every render. 
  // This would trick the useEffect into thinking it's a 'new' function, triggering it constantly and causing an infinite loop.
  const handleLogout = React.useCallback(() => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  /**
   * When the app first loads, check if user has a saved theme preference.
   * 
   * Priority order:
   * 1. Check localStorage for previously saved theme
   * 2. If no saved theme, check user's system preference (dark mode setting)
   * 3. If neither, default to light mode
   * 
   * This runs only once when component mounts (empty dependency array [])
   */
  useEffect(() => {
    // Safety check: make sure we're in the browser (not server-side rendering)
    if (typeof window === 'undefined') return;

    // Try to get the theme from browser's local storage
    // This remembers user's choice even after closing the browser
    const storedTheme = localStorage.getItem('theme');

    // If we found a valid saved theme, use it
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
    // Otherwise, check if user's system is set to dark mode
    // This is a nice touch - respects user's OS-level preference
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    // If nothing found, it stays as the default 'light' we set above
  }, []);

  //This effect handles persisting the user session. If the user refreshes the page, we lose the React state. This code checks if we have a valid token, and if so, it fetches the user profile from the backend to restore the session. If the token is invalid/expired, it automatically logs the user out.
  useEffect(() => {
    const loadProfile = async () => {
      if (!authToken || currentUser) return;
      setIsLoadingSession(true);
      try {
        const profile = await fetchProfile(authToken);
        setCurrentUser(profile);
        localStorage.setItem('auth_user', JSON.stringify(profile));
      } catch (error) {
        console.error('Failed to load profile', error);
        handleLogout();
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadProfile();
  }, [authToken, currentUser, handleLogout]);

  //Whenever the theme changes, update the HTML element's class.
  //Tailwind CSS uses the 'dark' class on the root element to apply dark mode styles.
  //We also save the theme to localStorage so it persists across page refreshes.
  //This runs every time 'theme' state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get the root HTML element (<html> tag)
    const root = document.documentElement;

    // Add or remove the 'dark' class based on current theme
    // Tailwind CSS will automatically apply dark mode styles when this class exists
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save the current theme to localStorage so it persists
    // Next time user visits, we'll load this preference
    localStorage.setItem('theme', theme);
  }, [theme]); // Run this effect whenever 'theme' changes

  /**
   * Detect if user is on a mobile device and adjust sidebar accordingly.
   * 
   * Why this matters:
   * - On mobile, we want sidebar closed by default (saves screen space)
   * - On desktop, we want it open by default (more screen real estate)
   * - We also listen for window resize events in case user rotates device
   * 
   * This runs once on mount, then listens for window resize events
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to check if current screen width is mobile-sized
    // 768px is Tailwind's 'md' breakpoint - below this is considered mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      // If mobile, close sidebar. If desktop, open it.
      // This gives mobile users more screen space for content
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check immediately when component loads
    checkMobile();

    // Also check whenever user resizes the window
    // This handles cases like rotating phone or resizing browser window
    window.addEventListener('resize', checkMobile);

    // Cleanup: remove the event listener when component unmounts
    // This prevents memory leaks
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Toggle between light and dark theme.
   * 
   * Simple function: if current theme is 'dark', switch to 'light', and vice versa.
   * The useEffect above will automatically apply the change to the page.
   */
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Called when user clicks a navigation item in the sidebar.
   * 
   * @param {string} view - Which page to show ('dashboard', 'tasks', 'calendar', etc.)
   * 
   * On mobile devices, we automatically close the sidebar after navigation.
   * This is a common UX pattern - gives users more screen space to see the content.
   */
  const handleViewChange = (view: string) => {
    // Update which page we're showing
    setCurrentView(view);

    // If user is on mobile, close the sidebar after they select a page
    // This gives them more room to see the content they just navigated to
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  /**
   * Called when user types in the search bar in the header.
   * 
   * @param {string} query - The text the user typed
   * 
   * We store this search query and pass it down to TasksPage,
   * which will use it to filter the tasks that are displayed.
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAuthSuccess = (data: AuthResponse) => {
    setAuthToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setIsLoadingSession(false);
  };

  /**
   * Decides which page component to render based on currentView state.
   * 
   * Think of this as a router - it looks at what page the user wants to see
   * and returns the appropriate component.
   * 
   * @returns {React.ReactNode} The page component to display
   */
  const renderCurrentPage = () => {
    if (!authToken) {
      return null;
    }

    switch (currentView) {
      case 'dashboard':
        // Show the analytics dashboard with charts and stats
        return <DashboardPage token={authToken} />;

      case 'tasks':
        // Show the main tasks page, and pass along the search query
        // so it can filter tasks as user types
        return <TasksPage searchQuery={searchQuery} token={authToken} />;

      case 'calendar':
        // Show the calendar view
        return <CalendarPage token={authToken} />;

      case 'team':
      case 'settings':
      default:
        // These pages aren't built yet, so show a "coming soon" message
        // This is a placeholder for future features
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
    }
  };

  if (!authToken && !isLoadingSession) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} theme={theme} onToggleTheme={handleToggleTheme} />;
  }

  return (
    <div className="min-h-screen  bg-background text-foreground">
      {/* 
        Backdrop overlay for mobile devices
        When sidebar is open on mobile, show a semi-transparent dark overlay
        behind it. Clicking this overlay closes the sidebar.
        This is a common mobile UI pattern (like mobile menus).
      */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 
        Sidebar Navigation
        Pass down the current view so it can highlight the active page,
        and give it functions to change pages and toggle open/close.
      */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* 
        Main Content Area
        This is where the actual page content lives (Dashboard, Tasks, Calendar).
        
        The margin-left (ml) classes create space for the sidebar:
        - When sidebar is open: 64 units of margin (256px) to make room for full sidebar
        - When sidebar is closed: 16 units (64px) for the collapsed sidebar icon
        - On mobile (ml-0): No margin, sidebar overlays instead
        
        The transition-all makes the margin change smooth when sidebar opens/closes.
      */}
      <div
        className={`transition-all duration-300 ${!isSidebarOpen && isMobile ? 'ml-12' : 'ml-12'
          } ${isSidebarOpen
            ? 'md:ml-64' // Full sidebar width on desktop when open
            : 'md:ml-16' // Collapsed sidebar width on desktop when closed
          }`}
      >
        {/* 
          Header Bar
          Contains search bar, theme toggle, and user info.
          We pass the search query and theme state so header can display/control them.
        */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMobile={isMobile}
          userName={currentUser?.name}
          onLogout={handleLogout}
        />

        {/* 
          Page Content Container
          This is where the actual page (Dashboard, Tasks, or Calendar) gets rendered.
          The padding (p-6) gives some breathing room around the content.
        */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default App;
