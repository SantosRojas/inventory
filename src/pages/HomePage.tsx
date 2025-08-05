// pages/HomePage.tsx


import {useAuthStore} from "../features/auth/store/store.ts";

const HomePage = () => {
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)

    return (
        <div className="p-4">
            <h1 className="text-xl">Bienvenido, {user?.firstName}</h1>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white">Cerrar sesión</button>
        </div>
    )
}
 export default HomePage;