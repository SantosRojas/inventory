// features/auth/types.ts
// features/auth/types.ts
export interface User {
    id: number
    firstName: string
    lastName: string
    cellPhone: string
    email: string
    createdAt: string   // o Date, si lo parseas
    updatedAt: string   // o Date
    role: 'admin' | 'technician' | 'sales_representative' | 'guest' // puedes ajustar según tus roles posibles
}

export interface UserToRegister{
    firstName: string
    lastName: string
    cellPhone: string
    email: string
}


export interface AuthResponse {
    token: string
    user: User
}
