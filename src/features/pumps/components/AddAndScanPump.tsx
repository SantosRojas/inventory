import { Plus, QrCode } from "lucide-react";
import { Button } from "../../../components";
import { usePumpStore } from "../store";

interface AddAndScanPumpProps {
    onQRScan: () => void;
    onAdd: () => void;

}

const AddAndScanPump = ({
    onQRScan,
    onAdd,
}: AddAndScanPumpProps) => {
    const isLoading = usePumpStore((state) => state.isLoading);

    return (
        // <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">


        // </div>
        <div className="flex gap-3">

            <Button
                onClick={onAdd}
                variant="primary"
                size="bs"
                icon={Plus}
                disabled={isLoading}
            >
                Agregar
            </Button>

            <Button
                onClick={onQRScan}
                disabled={isLoading}
                icon={QrCode}
                variant="outline"
                size="bs"
                className="border-gray-300 hover:bg-gray-50 flex"
            >
                Escanear
            </Button>
        </div>
    )
}

export default AddAndScanPump;