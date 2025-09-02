
import { Eye, EyeOff } from 'lucide-react';
import AddAndScanPump from './AddAndScanPump.tsx';
import SearchPump from "./SearchPump.tsx";
import Button from '../../../components/Button.tsx';

interface PumpsToolbarProps {
    showHistory: boolean
    onCloseHistory: () => void
    onQRScan: () => void;
    onAdd: () => void;
}

const PumpsToolbar = (
    {
        showHistory,
        onCloseHistory,
        onQRScan,
        onAdd,
    }: PumpsToolbarProps) => {

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl">
            <div className='flex gap-4'>
                <AddAndScanPump
                    onQRScan={onQRScan}
                    onAdd={onAdd}
                />
                <Button onClick={onCloseHistory} className='flex gap-3'>
                    {
                        showHistory ? (
                            <>
                                <EyeOff className='h-4 w-4' />
                                <span className='hidden sm:inline'>Ocultar Historial</span>
                            </>
                        ) : (
                            <>
                                <Eye className='h-4 w-4' />
                                <span className='hidden sm:inline'>Mostrar Historial</span>
                            </>
                        )
                    }

                </Button>

            </div>
            <SearchPump />

        </div>
    );
};

export default PumpsToolbar;