/**
 * 404 Not Found Page
 * 
 * Matches the dashboard style with dark/light mode support.
 * Includes a friendly message, illustration, and a "Go Home" button.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center space-y-6 bg-gray-50 dark:bg-sidebar-accent">
      <AlertCircle className="text-red-500 dark:text-red-400 w-20 h-20" />
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button
        variant="default"
        onClick={() => navigate('/')}
        className="mt-2 px-6 py-2"
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
