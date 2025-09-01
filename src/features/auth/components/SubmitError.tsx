import { AlertCircle, XCircle } from "lucide-react"

interface Props {
    error: string | null
    onClose: () => void
}

const SubmitError = ({ error, onClose }: Props) => {
    return (
        <div className="flex items-start justify-between p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                title="Borrar mensaje"
                className="flex items-center justify-center mt-0.5   hover:scale-110 transition-colors"
                aria-label="Cerrar mensaje de error"
            >
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 cursor-pointer"  />
            </button>


        </div>
    )
}

export default SubmitError;