import {type JSX, useState} from "react";
import { Barcode, ScanLine } from "lucide-react";

type OptionType = "serial" | "qr";
interface Props {
    handleChangeTarget:(value:OptionType) => void;
}

export default function SerialQRSelector({handleChangeTarget}: Props): JSX.Element {
    const [selectedOption, setSelectedOption] = useState<OptionType>("serial");

    const handleSearchChange = (value: OptionType) => {
        handleChangeTarget(value);
        setSelectedOption(value)
    }

    const options: { label: string; value: OptionType; icon: JSX.Element }[] = [
        {
            label: "Serie",
            value: "serial",
            icon: <Barcode className="w-4 h-4" />,
        },
        {
            label: "QR",
            value: "qr",
            icon: <ScanLine className="w-4 h-4" />,
        },
    ];

    return (
        <div className="relative bg-gray-200 rounded-full p-0.5 flex w-full max-w-xs">
            {/* Indicador deslizante */}
            <div
                className={`absolute top-0.5 bottom-0.5 w-1/2 bg-blue-600 rounded-full shadow-md transition-transform duration-300 ease-out ${
                    selectedOption === "qr" ? "translate-x-full" : "translate-x-0"
                }`}
            />

            {options.map(({ label, value, icon }) => {
                const isActive = selectedOption === value;

                return (
                    <button
                        key={value}
                        onClick={() => handleSearchChange(value)}
                        className={`relative z-10 flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-300 ease-out flex items-center justify-center gap-1.5 ${
                            isActive
                                ? "text-white scale-105"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        <span className="text-sm">{icon}</span>
                        <span
                            className={`transition-all duration-300 ${
                                isActive ? "font-semibold" : "font-medium"
                            }`}
                        >
          {label}
        </span>
                    </button>
                );
            })}
        </div>

    );
}
