import React from 'react';

const PageLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Cargando...</p>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
