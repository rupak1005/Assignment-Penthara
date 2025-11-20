/**
 * Sidebar Component
 * 
 * Left navigation sidebar with menu items.
 * Displays navigation options for the application.
 */

import React from 'react';
import { Menu, BarChart3, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sidebar component for navigation
 * @param {SidebarProps} props - Component props
 */
const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle }) => {

  /**
   * Navigation menu items
   */
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'My Tasks', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    // { id: 'team', label: 'Team', icon: Users },
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 md:z-40 border-r border-sidebar-border ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4">
        {/* Header with menu toggle and branding */}
        {/* Header with menu toggle and branding */}
<div className="flex items-center gap-3 mb-8">
  <Button
    variant="ghost"
    size="icon"
    onClick={onToggle}
    className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  >
    <Menu size={20} />
  </Button>

  {isOpen && (
    <div className="flex items-center gap-2">
      <img 
        src="/tick.svg" 
        alt="Logo"
        className="h-6 w-6"
      />
      <h1 className="text-xl font-bold text-sidebar-foreground">
        TaskMaster
      </h1>
    </div>
  )}
</div>


        {/* Navigation menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 text-sidebar-foreground ${
                  !isOpen && 'justify-center'
                } ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

