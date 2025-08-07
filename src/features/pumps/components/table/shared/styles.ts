// Clase de utilidades de estilos reutilizables para componentes de tabla

export const BUTTON_STYLES = {
  // Botones de acción base
  actionBase: "inline-flex items-center rounded-lg transition-colors duration-150",
  
  // Botones de desktop
  actionDesktop: "p-1 lg:p-1.5 xl:p-2",
  
  // Botones de tarjetas móviles
  actionMobile: "px-4 py-2 text-sm border",
  
  // Variaciones de color
  edit: "text-blue-600 hover:text-blue-900 hover:bg-blue-100",
  editMobile: "text-blue-600 hover:text-blue-900 hover:bg-blue-50 border-blue-200",
  delete: "text-red-600 hover:text-red-900 hover:bg-red-100",
  deleteMobile: "text-red-600 hover:text-red-900 hover:bg-red-50 border-red-200",
} as const;

export const LAYOUT_STYLES = {
  // Contenedores flex comunes
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex justify-between items-start",
  flexEnd: "flex justify-end",
  
  // Espaciado común
  spaceX1: "space-x-1",
  spaceX3: "space-x-3",
  
  // Contenedor de full width con layout responsivo
  fullWidthLayout: "flex items-center space-x-1 w-full min-w-0",
  
  // Contenedor centrado
  centerContainer: "text-center",
  
  // Padding común para estados
  statesPadding: "p-12",
  contentPadding: "py-12",
} as const;

export const TEXT_STYLES = {
  // Truncate común
  truncate: "block truncate text-ellipsis overflow-hidden whitespace-nowrap w-full",
  
  // Tamaños de texto comunes
  textXs: "text-xs",
  textSm: "text-sm",
  
  // Font weights
  fontMedium: "font-medium",
  fontSemibold: "font-semibold",
  fontMono: "font-mono",
  
  // Colores de texto comunes
  textGray500: "text-gray-500",
  textGray600: "text-gray-600",
  textGray700: "text-gray-700",
  textGray900: "text-gray-900",
} as const;

export const BADGE_STYLES = {
  // Badge base
  base: "inline-flex px-1 lg:px-2 xl:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap overflow-hidden",
  mobile: "inline-flex px-3 py-1 text-xs font-semibold rounded-full border",
} as const;

export const BORDER_STYLES = {
  // Bordes comunes
  right: "border-r border-gray-200",
  rightLight: "border-r border-gray-100",
  top: "border-t border-gray-200",
} as const;

// Función helper para combinar clases
export const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
