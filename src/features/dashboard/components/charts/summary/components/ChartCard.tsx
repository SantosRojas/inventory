import type { ReactNode } from "react";

const bgColors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
    // Puedes agregar más si necesitas
};

interface ChartCardProps {
    title: string;
    value: string;
    bgFrom: keyof typeof bgColors;
    children?: ReactNode;
    icon?: ReactNode;
}

const ChartCard = ({
                       title,
                       value,
                       bgFrom,
                       children,
                       icon,
                   }: ChartCardProps) => {
    const bgClass = bgColors[bgFrom] || "from-gray-400 to-gray-500";

    return (
        <div className={`bg-gradient-to-r ${bgClass} p-3 sm:p-4 rounded-lg text-white min-w-0 overflow-hidden`}>
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium opacity-90 break-words">{title}</p>
                    <p className="text-lg sm:text-2xl font-bold break-words">{value}</p>
                    <div className="min-w-0">
                        {children}
                    </div>
                </div>
                {icon && <div className="text-2xl sm:text-3xl opacity-75 flex-shrink-0">{icon}</div>}
            </div>
        </div>
    );
};

export default ChartCard;
