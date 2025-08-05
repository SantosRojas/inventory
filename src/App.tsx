import { AppRoutes } from './routes';
import {useAuthStore} from "./features/auth/store/store.ts";
import {useEffect} from "react";

function App() {
    const validateToken = useAuthStore((state) => state.validateToken);
    console.log('App');
    useEffect(() => {
        validateToken().then(r => console.log("validado"+r))
    }, [validateToken])
    return <AppRoutes />;
}

export default App;