import { AppRoutes } from './routes';
import { useTheme } from './hooks';

function App() {
    
    useTheme(); // Inicializar tema
    
    return <AppRoutes />;
}

export default App;