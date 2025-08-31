import { useEffect, useState } from "react";
import getTokenExp from "../utils/getTokenExp";

interface TokenCountdownProps {
  token: string;
  onLogout: () => void;
}

export const TokenCountdown = ({ token, onLogout }: TokenCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const expMs = getTokenExp(token);
    if (!expMs) {
      onLogout();
      return;
    }

    const updateTime = () => {
      console.log('Actualizando contador de sesión');
      const now = Date.now();
      const msRemaining = expMs - now;

      if (msRemaining <= 0) {
        onLogout();
        setTimeLeft(null);
        return;
      }

      const totalSeconds = Math.floor(msRemaining / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [token, onLogout]);

  if (!timeLeft) return null;

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 5;

  return (
    // <div className="p-3 border rounded-lg flex items-center justify-between bg-yellow-50 text-yellow-800">
    //   <div>
    //     <p className="font-medium text-sm">⚠️ Sesión expira en:</p>
    //     <p className="font-mono text-lg font-bold">
    //       {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    //     </p>
    //   </div>
    //   <div className="flex gap-2">
    //     <button
    //       onClick={onLogout}
    //       className="px-3 py-1 border border-green-600 bg-green-100 text-green-700 rounded hover:bg-green-200"
    //     >
    //       Renovar sesión
    //     </button>
    //     <button
    //       onClick={onClose}
    //       className="h-8 w-8 flex items-center justify-center rounded-full border border-red-600 text-red-600 hover:bg-red-200"
    //     >
    //       ✕
    //     </button>
    //   </div>
    // </div>

    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        gap-3 p-2 mb-4 border-2 border-l-4 rounded-lg transition-colors duration-150
        ${isUrgent
          ? "border-red-400 bg-red-100 hover:bg-red-200 text-red-800"
          : "border-yellow-400 bg-yellow-50 hover:bg-yellow-200 text-yellow-800"}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-medium text-sm sm:text-base">Sesión expira en:</p>
          <p className="font-mono text-lg font-bold">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="
            flex-1 sm:flex-none px-4 py-2 border-2 border-green-400 bg-green-100 text-black
            rounded-md hover:!bg-green-400 transition-colors
            text-sm font-medium cursor-pointer
          "
        >
          Renovar sesión
        </button>
      </div>
    </div>



  );
};
