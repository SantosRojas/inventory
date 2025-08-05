import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components';

interface ErrorLayoutProps {
  title: string;
  message: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Activity className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            InventarioMed
          </h2>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-600 mb-8">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showBackButton && (
                <Button
                  variant="secondary"
                  icon={ArrowLeft}
                  onClick={() => window.history.back()}
                >
                  Volver Atrás
                </Button>
              )}
              
              {showHomeButton && (
                <Link to="/dashboard">
                  <Button variant="primary" icon={Home}>
                    Ir al Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLayout;
