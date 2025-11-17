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
}

/**
 * Header component for top navigation bar
 * @param {HeaderProps} props - Component props
 */
const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, theme, onToggleTheme }) => {
  return (
    <div className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search tasks, projects, and teams"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Messages">
            <Mail size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User size={20} className="text-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground/80">Welcome to</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

