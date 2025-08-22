import type {PieLabelProps} from "recharts/types/polar/Pie";

// const CustomizedLabelPie = (props: PieLabelProps) => {
//     const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
//     if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent || percent < 0.05) return null;

//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//         <text
//             x={x}
//             y={y}
//             fill="white"
//             textAnchor={x > cx ? 'start' : 'end'}
//             dominantBaseline="central"
//             fontSize={12}
//             fontWeight="bold"
//         >
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// export  default CustomizedLabelPie;

// Función para mostrar porcentajes fuera del gráfico con líneas
    const CustomizedLabelPie = (props: PieLabelProps) => {
        const { cx, cy, midAngle, outerRadius, percent } = props;
        if (!cx || !cy || midAngle === undefined || !outerRadius || !percent || percent < 0.05) return null;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30; // Posición fuera del gráfico
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        // Punto de conexión en el borde del gráfico
        const lineRadius = outerRadius + 10;
        const lineX = cx + lineRadius * Math.cos(-midAngle * RADIAN);
        const lineY = cy + lineRadius * Math.sin(-midAngle * RADIAN);

        // Solo mostrar porcentajes mayores al 2% para evitar saturación
        if (percent < 0.02) return null;

        return (
            <g>
                {/* Línea de conexión */}
                <line
                    x1={lineX}
                    y1={lineY}
                    x2={x}
                    y2={y}
                    stroke="#666"
                    strokeWidth={1}
                />
                {/* Texto con porcentaje */}
                <text 
                    x={x} 
                    y={y} 
                    fill="#374151" 
                    textAnchor={x > cx ? 'start' : 'end'} 
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="600"
                >
                    {`${(percent * 100).toFixed(1)}%`}
                </text>
            </g>
        );
    };


    export default CustomizedLabelPie;