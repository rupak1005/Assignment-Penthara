/**
 * Header Component
 * 
 * Top header bar with search functionality and user actions.
 * Displays search bar, notifications, and user profile.
 */

import React from 'react';
import { Search, Bell, Mail, User, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isMobile?: boolean;
}

/**
 * Header component for top navigation bar
 * @param {HeaderProps} props - Component props
 */
const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  isMobile = false,
}) => {
  return (
    <div
      className={`bg-sidebar border-b border-border w-full dark:bg-sidebar ${
        isMobile ? 'px-4 py-3 rounded-lg' : 'px-8 py-4 rounded-lg'
      }`}
    >
      <div className="flex items-center justify-between dark:text-gray-100">
        {/* Search bar */} 
        <div className="flex-1 max-w-xl dark:text-gray-100">
          <div className="relative dark:text-gray-100">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 rounded-full bg-gray-100  dark:bg-sidebar-accent"
              size={20}
            />
            <Input
              placeholder="Search tasks, projects, and teams"
              className="pl-10 w-full dark:text-gray-100  bg-gray-100  dark:bg-sidebar-accent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-4 dark:text-gray-100">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="dark:text-gray-100 hidden sm:block md:p-2 justify-center items-center"
          >
            <Bell size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Messages"
            className="dark:text-gray-100 hidden sm:block md:p-2 justify-center items-center"
          >
            <Mail size={20} />
          </Button>
          <div className="flex items-center gap-2 dark:text-gray-100  ">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center dark:bg-sidebar-accent ">
              <User size={20} className="text-foreground dark:text-gray-100" />
            </div>
            <span className="text-sm font-medium text-foreground/80 dark:text-gray-100">Welcome</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

