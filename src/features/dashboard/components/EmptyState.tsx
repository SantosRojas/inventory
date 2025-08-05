import React from 'react'
import { UserPlus } from 'lucide-react'

interface EmptyStateProps {
    title?: string
    message?: string
    actionLabel?: string
    onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                          title = 'Sin datos disponibles',
                                                          message = 'Parece que aún no has agregado nada. ¡Comienza creando tu primer elemento!',
                                                          actionLabel = 'Empezar',
                                                          onAction,
                                                      }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
                <UserPlus className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

            <p className="text-gray-500 max-w-md">{message}</p>

            {onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                >
                    <UserPlus className="w-4 h-4" />
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState;