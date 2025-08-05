import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface StatusMessagesProps {
    error?: string;
    success?: string;
    onClearMessages?: () => void;
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({
                                                                  error,
                                                                  success,
                                                                  onClearMessages,
                                                              }) => {
    if (!error && !success) return null;

    return (
        <div className="space-y-3">
            {error && (
                <div className="flex items-start justify-between p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                    {onClearMessages && (
                        <button
                            onClick={onClearMessages}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            aria-label="Cerrar mensaje de error"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {success && (
                <div className="flex items-start justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Éxito</p>
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                    {onClearMessages && (
                        <button
                            onClick={onClearMessages}
                            className="text-green-400 hover:text-green-600 transition-colors"
                            aria-label="Cerrar mensaje de éxito"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
