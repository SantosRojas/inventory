
import AddAndScanPump from './AddAndScanPump.tsx';
import SearchPump from "./SearchPump.tsx";

interface PumpsToolbarProps {
    onQRScan: () => void;
    onAdd: () => void;
}

const PumpsToolbar = (
    {
        onQRScan,
        onAdd,
    }: PumpsToolbarProps) => {

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl">
            <AddAndScanPump
                onQRScan={onQRScan}
                onAdd={onAdd}
            />
            <SearchPump />

        </div>
    );
};

export default PumpsToolbar;