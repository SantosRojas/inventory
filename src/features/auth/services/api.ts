// features/auth/services.ts
// features/auth/services.ts
import type {AuthResponse, User, UserToRegister} from '../types/types.ts'
import type {LoginInput} from '../schemas'

const API_URL = 'http://localhost:3001/auth'

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseJSON = await res.json();

        if (!res.ok || !responseJSON.success) {
            // Extrae mensaje si lo tiene, o da uno genérico
            const errorMessage = responseJSON?.message || 'Error al iniciar sesión';
            throw new Error(errorMessage);
        }

        // ✅ Garantizamos que responseJSON.data tiene { token, user }
        return responseJSON.data as AuthResponse;
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message || 'Error inesperado al iniciar sesión');
        }
        throw new Error('Error inesperado al iniciar sesión');
    }
};



export const registerUser = async (data: UserToRegister): Promise<AuthResponse> => {

    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error('Error al registrar'+ res)
    const responseJSON = await res.json()
    return responseJSON.data // 👈 EXTRAES data correctamente
}

export const checkTokenValidity = async (token: string): Promise<User> => {
    const res = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!res.ok) throw new Error('Token inválido o expirado')
    const responseJSON = await res.json()
    return responseJSON.data // 👈 EXTRAES data correctamente
}
