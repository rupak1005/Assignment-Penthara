/**
 * App Component
 * 
 * Main application component.
 * Renders the task tracker application with sidebar and header layout.
 */

import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import './App.css';

/**
 * App component - Root component of the application
 */
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Handles view change from sidebar navigation
   * @param {string} view - View identifier
   */
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  /**
   * Handles search query change
   * @param {string} query - Search query string
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  /**
   * Renders the current page based on view
   * @returns {React.ReactNode} Current page component
   */
  const renderCurrentPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tasks':
        return <TasksPage searchQuery={searchQuery} />;
      case 'calendar':
        return <CalendarPage />;
      case 'team':
      case 'settings':
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main content area with header */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Page content */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default App;
